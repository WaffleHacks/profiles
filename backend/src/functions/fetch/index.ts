import { config } from '@functions/authorizer';
import { resolve } from '@libs/lambda';

export default {
  handler: `${resolve(__dirname)}/handler.main`,
  events: [
    {
      http: {
        path: 'profile',
        method: 'get',
        cors: true,
        authorizer: config,
      },
    },
  ],
};
