import {CustomRequestHandler} from 'types/utils';
import {asyncWrapper} from '@src/utils';

const sessionMiddleware: CustomRequestHandler = async (request, response, next) => {
  const {auth} = request.cookies;
  if (!auth) response.sendStatus(401);

  //TODO: ...

  next();
};

export const session = asyncWrapper(sessionMiddleware);
