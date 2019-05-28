import { CustomRequestHandler } from 'types/utils';
import { asyncWrapper } from '@src/utils';

import { AuthServices } from '@src/pkg/authorizing/authorizing.services';
import { logger } from '@src/utils/logger';
import { exctractClientData } from '@src/utils/extract-client-data';
import { CacheServices } from '@src/pkg/cache/cache.services';

const sessionMiddleware: CustomRequestHandler = async (request, _, next) => {
  const { __session } = request.cookies;
  if (__session) {
    try {
      let auth = await CacheServices.getSession(__session);
      if (auth) request.auth = auth;
      else {
        auth = await AuthServices().getSession({ sessionToken: __session });
        request.auth = auth;
        await CacheServices.setSession({ sessionToken: __session, ...auth });
      }
      next();
    } catch (error) {
      next(error);
      logger.info(exctractClientData(request) + ' is unauthorized');
    }
  } else next();
};

export const session = asyncWrapper(sessionMiddleware);
