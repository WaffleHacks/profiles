import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { error, success } from '@libs/api-gateway';
import { ProfileType } from '@libs/jwt';
import { middyfy } from '@libs/lambda';
import User from '@libs/user';

import schema from './schema';

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  if (event.requestContext.authorizer.type !== ProfileType.Session)
    return error(403, 'only session tokens can create profiles');

  try {
    await User.create(
      event.requestContext.authorizer.id,
      event.requestContext.authorizer.email,
      event.body.firstName,
      event.body.lastName,
    );

    return success(201);
  } catch (e) {
    return error(409, 'already exists');
  }
};

export const main = middyfy(handler);
