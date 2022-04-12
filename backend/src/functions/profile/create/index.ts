import { config } from '@functions/authorizer';
import { resolve } from '@libs/lambda';

import schema from './schema';

export default {
  handler: `${resolve(__dirname)}/handler.main`,
  events: [
    {
      http: {
        path: 'profile',
        method: 'post',
        cors: true,
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
