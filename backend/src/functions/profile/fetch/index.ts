import { config } from '@functions/authorizer';
import { cors, resolve } from '@libs/lambda';

export default {
  handler: `${resolve(__dirname)}/handler.main`,
  events: [
    {
      http: {
        path: 'profile',
        method: 'get',
        cors,
        authorizer: config,
      },
    },
  ],
};
