import type { APIGatewayTokenAuthorizerHandler } from 'aws-lambda';

import { validate } from '@libs/jwt';

export const main: APIGatewayTokenAuthorizerHandler = async (event) => {
  try {
    const principalId = await validate(event.authorizationToken);
    return {
      principalId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: event.methodArn,
          },
        ],
      },
    };
  } catch (e) {
    throw new Error('Unauthorized');
  }
};
