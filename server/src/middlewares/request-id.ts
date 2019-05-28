import uuidv1 from 'uuid/v1';
import { CustomRequestHandler } from 'types/utils';

export const uniqueRequestId: CustomRequestHandler = (request, response, next) => {
  if (!request.headers['user-agent']) return response.sendStatus(403);
  request.id = (request.header('x-request-id') as string) || uuidv1();
  response.setHeader('x-request-id', request.id);
  next();
};
