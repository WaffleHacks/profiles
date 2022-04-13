import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> };
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>;

// CORS headers to return
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export const success = (status = 200) => ({ statusCode: status, body: '', headers });

export const successWithJSON = (response: unknown, status = 200) => ({
  statusCode: status,
  body: JSON.stringify(response),
  headers,
});

export const error = (status: number, reason: string) => ({
  statusCode: status,
  body: JSON.stringify({ reason }),
  headers,
});
