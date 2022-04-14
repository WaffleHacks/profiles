import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { error, success } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import User from '@libs/user';

import schema from './schema';

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  // Fetch the user's profile
  const profile = await User.get(event.requestContext.authorizer.id);
  if (!profile) return error(404, 'not found');

  // Update fields (the errors can be ignored here)
  if (event.body.email) profile.email = event.body.email;
  if (event.body.firstName) profile.firstName = event.body.firstName;
  if (event.body.lastName) profile.lastName = event.body.lastName;

  await profile.save();

  return success(204);
};

export const main = middyfy(handler);
