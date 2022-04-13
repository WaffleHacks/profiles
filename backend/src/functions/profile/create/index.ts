import { config } from '@functions/authorizer';
import { cors, resolve } from '@libs/lambda';

import schema from './schema';

export default {
  handler: `${resolve(__dirname)}/handler.main`,
  events: [
    {
      http: {
        path: 'profile',
        method: 'post',
        cors,
        authorizer: config,
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};
