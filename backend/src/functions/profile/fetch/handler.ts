import type { APIGatewayProxyHandler } from 'aws-lambda';

import { error, successWithJSON } from '@libs/api-gateway';
import { staticProfile } from '@libs/jwt';
import { middyfy } from '@libs/lambda';
import User from '@libs/user';

const handler: APIGatewayProxyHandler = async (event) => {
  const id = staticProfile(event.headers.Authorization).id;
  const profile = await User.get(id);

  if (profile) return successWithJSON(profile);
  return error(404, 'not found');
};

export const main = middyfy(handler);
