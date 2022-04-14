import { APIGatewayProxyHandler, error, successWithJSON } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import User from '@libs/user';

const handler: APIGatewayProxyHandler = async (event) => {
  const profile = await User.get(event.requestContext.authorizer.id);

  if (profile) return successWithJSON(profile);
  return error(404, 'not found');
};

export const main = middyfy(handler);
