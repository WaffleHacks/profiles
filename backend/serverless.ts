import type { AWS } from '@serverless/typescript';

import authorizer from '@functions/authorizer';
import hello from '@functions/hello';
import initial from '@functions/initial';

const tableName = 'profile-info-${sls:stage}';

const serverlessConfiguration: AWS = {
  service: 'profiles',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
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
      JWT_ISSUER: '${ssm:/profiles/issuer}',
      JWT_HS256_SIGNING_TOKEN: '${ssm:/profiles/signing/hs256}',
      JWT_RS256_SIGNING_JWKS_URI: '${ssm:/profiles/signing/rs256}',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:UpdateItem', 'dynamodb:DeleteItem'],
            Resource: [{ 'Fn::GetAtt': ['UsersTable', 'Arn'] }],
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { authorizer, hello, initial },
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
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
