import uuidv1 from 'uuid/v1';
import {CustomRequestHandler} from 'types/utils';

export const uniqueRequestId: CustomRequestHandler = (request, response, next) => {
  const contentType = request.is('json') || request.is('urlencoded') || request.is('html');
  if (!contentType) return response.sendStatus(406);
  if (!request.headers['user-agent']) return response.sendStatus(403);
  const id = uuidv1();
  request.id = id;
  response.header('X-Request-ID', id);
  next();
};
