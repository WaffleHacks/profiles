import { resolve } from '@libs/lambda';

export default {
  handler: `${resolve(__dirname)}/handler.main`,
};

export const config = {
  name: 'authorizer',
  // Cache for the duration of an Auth0 session token (15 mins)
  resultTtlInSeconds: 900,
  identitySource: 'method.request.header.Authorization',
  type: 'TOKEN',
};
