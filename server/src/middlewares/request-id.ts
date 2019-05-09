import uuidv1 from 'uuid/v1';
import {CustomRequestHandler} from 'types/utils';

export const uniqueRequestId: CustomRequestHandler = (request, response, next) => {
  if (!request.headers['user-agent']) return response.sendStatus(403);
  const id = uuidv1();
  request.id = id;
  response.header('X-Request-ID', id);
  request.initTime = Date.now();
  next();
  response.header('X-Runtime', String(Date.now() - request.initTime));
};
