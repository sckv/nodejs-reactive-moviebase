// import uuidv1 from 'uuid/v1';
import {CustomRequestHandler} from 'types/utils';
// import {logger} from '@src/utils/logger';

export const uniqueRequestId: CustomRequestHandler = (request, response, next) => {
  if (!request.headers['user-agent']) return response.sendStatus(403);
  // const id = uuidv1();

  request.id = request.header('x-request-id') as string;
  response.setHeader('x-request-id', request.id);
  request.initTime = Date.now();
  // logger.info(request);
  next();
  response.header('x-runtime', (Date.now() - request.initTime) as any);
};
