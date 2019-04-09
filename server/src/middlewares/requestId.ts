import uuidv1 from 'uuid/v1';
import {CustomRequestHandler} from 'types/utils';

export const uniqueRequestId: CustomRequestHandler = (request, response, next) => {
  const contentType = request.is('json') || request.is('urlencoded') || request.is('html');
  if (!contentType) response.status(406).end();
  if (!request.headers['user-agent']) response.status(403).end();
  const id = uuidv1();
  request.id = id;
  response.header('X-Request-ID', id);
  next();
};
