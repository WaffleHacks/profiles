import type { AWS } from '@serverless/typescript';

import authorizer from '@functions/authorizer';
import { all, single } from '@functions/manage';
import { create, fetch, update } from '@functions/profile';
import sync from '@functions/sync';

const tableName = 'profile-info-${sls:stage}';

const serverlessConfiguration: AWS = {
  service: 'profiles',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  configValidationMode: 'error',
  provider: {
    name: 'aws',
    stage: 'dev',
    region: 'us-west-2',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      USERS_TABLE: tableName,
      JWT_REDIRECT_ISSUER: '${ssm:/profiles/redirect/issuer}',
      JWT_REDIRECT_SIGNING_KEY: '${ssm:/profiles/redirect/signing-key}',
      JWT_USER_ISSUER: '${ssm:/profiles/user/issuer}',
      JWT_USER_JWKS_URI: '${ssm:/profiles/user/jwks-uri}',
      SYNC_TOPIC: {
        Ref: 'SyncTopic',
      },
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
              'dynamodb:Scan',
            ],
            Resource: [{ 'Fn::GetAtt': ['UsersTable', 'Arn'] }],
          },
          {
            Effect: 'Allow',
            Action: ['sns:Publish'],
            Resource: [{ Ref: 'SyncTopic' }],
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: {
    authorizer,
    manageAll: all,
    manageSingle: single,
    profileCreate: create,
    profileFetch: fetch,
    profileUpdate: update,
    sync,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Conditions: {
      IsProd: {
        'Fn::Equals': ['${sls:stage}', 'prod'],
      },
    },
    Resources: {
      UsersTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: tableName,
          TableClass: 'STANDARD',
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],
          BillingMode: 'PROVISIONED',
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
          StreamSpecification: {
            StreamViewType: 'NEW_IMAGE',
          },
        },
      },
      CustomDomain: {
        Type: 'AWS::ApiGateway::DomainName',
        Condition: 'IsProd',
        Properties: {
          CertificateArn: '${ssm:/profiles/domain/certificate}',
          DomainName: '${ssm:/profiles/domain}',
          EndpointConfiguration: {
            Types: ['EDGE'],
          },
          SecurityPolicy: 'TLS_1_2',
        },
      },
      DomainMapping: {
        Type: 'AWS::ApiGateway::BasePathMapping',
        Condition: 'IsProd',
        Properties: {
          DomainName: '${ssm:/profiles/domain}',
          Stage: '${sls:stage}',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        },
      },
      GatewayResponseDefault4XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          },
        },
      },
      SyncTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          DisplayName: 'Profiles Sync (${sls:stage})',
          TopicName: 'profiles-sync-${sls:stage}',
          FifoTopic: false,
          Subscription: [],
        },
      },
      SyncTopicPolicy: {
        Type: 'AWS::SNS::TopicPolicy',
        Properties: {
          PolicyDocument: {
            Version: '2008-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  AWS: {
                    'Fn::GetAtt': ['IamRoleLambdaExecution', 'Arn'],
                  },
                },
                Action: ['sns:Publish'],
                Resource: { Ref: 'SyncTopic' },
                Condition: {
                  ArnEquals: {
                    'lambda:FunctionArn': { 'Fn::GetAtt': ['SyncLambdaFunction', 'Arn'] },
                  },
                },
              },
            ],
          },
          Topics: [{ Ref: 'SyncTopic' }],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
