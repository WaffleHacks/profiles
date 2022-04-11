import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';

export const middyfy = (handler) => middy(handler).use(middyJsonBodyParser());

export const resolve = (context: string) => `${context.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`;
