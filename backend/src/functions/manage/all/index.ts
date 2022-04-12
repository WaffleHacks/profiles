import { resolve } from '@libs/lambda';

export default {
  handler: `${resolve(__dirname)}/handler.main`,
  events: [
    {
      http: {
        path: 'manage',
        method: 'get',
        authorizer: 'AWS_IAM',
      },
    },
  ],
};
