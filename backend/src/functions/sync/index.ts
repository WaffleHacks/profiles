import { resolve } from '@libs/lambda';

export default {
  handler: `${resolve(__dirname)}/handler.main`,
  events: [
    {
      stream: {
        type: 'dynamodb',
        arn: {
          'Fn::GetAtt': ['UsersTable', 'StreamArn'],
        },
        batchSize: 5,
      },
    },
  ],
};
