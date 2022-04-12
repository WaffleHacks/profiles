import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { error, success } from '@libs/api-gateway';
import { staticProfile } from '@libs/jwt';
import { middyfy } from '@libs/lambda';
import User from '@libs/user';

import schema from './schema';

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const baseProfile = staticProfile(event.headers.Authorization);

  try {
    await User.createFromParts(baseProfile, event.body);

    return success(201);
  } catch (e) {
    return error(409, 'already exists');
  }
};

export const main = middyfy(handler);
