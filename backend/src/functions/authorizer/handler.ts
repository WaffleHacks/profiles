import type { APIGatewayTokenAuthorizerHandler } from 'aws-lambda';

import { validate } from '@libs/jwt';

/**
 * Construct a method ARN that allows GET, POST, & PATCH on /profile
 * @param arn the requested ARN
 * @returns a generic ARN
 */
const buildArn = (arn: string): string => {
  // Get the path
  const arnSegments = arn.split(':');
  const [path] = arnSegments.slice(-1);

  // Replace the HTTP verb
  const pathSegments = path.split('/');
  pathSegments[2] = '*';

  // Reconstruct the ARN
  arnSegments[arnSegments.length - 1] = pathSegments.join('/');
  return arnSegments.join(':');
};

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
            Resource: buildArn(event.methodArn),
          },
        ],
      },
    };
  } catch (e) {
    throw new Error('Unauthorized');
  }
};
