import { resolve } from '@libs/lambda';

export default {
  handler: `${resolve(__dirname)}/handler.main`,
};

export const config = {
  name: 'authorizer',
  resultTtlInSeconds: 300,
  identitySource: 'method.request.header.Authorization',
  type: 'TOKEN',
};
