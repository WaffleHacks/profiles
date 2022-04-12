import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> };
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>;

export const success = (status = 200) => ({ statusCode: status, body: '' });

export const successWithJSON = (response: Record<string, unknown>, status = 200) => ({
  statusCode: status,
  body: JSON.stringify(response),
});

export const error = (status: number, reason: string) => ({ statusCode: status, body: JSON.stringify({ reason }) });
