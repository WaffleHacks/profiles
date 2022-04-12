import type { APIGatewayProxyHandler } from 'aws-lambda';

import { error, successWithJSON } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import User from '@libs/user';

const handler: APIGatewayProxyHandler = async (event) => {
  const id = decodeURIComponent(event.pathParameters.id);
  const user = await User.get(id);

  if (user) return successWithJSON(user);
  else return error(404, 'not found');
};

export const main = middyfy(handler);
