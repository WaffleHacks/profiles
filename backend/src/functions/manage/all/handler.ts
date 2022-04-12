import type { APIGatewayProxyHandler } from 'aws-lambda';

import { successWithJSON } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import User from '@libs/user';

const handler: APIGatewayProxyHandler = async () => {
  const users = await User.all();
  return successWithJSON(users);
};

export const main = middyfy(handler);
