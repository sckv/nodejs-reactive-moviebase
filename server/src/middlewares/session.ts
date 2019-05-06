import {CustomRequestHandler} from 'types/utils';
import {asyncWrapper} from '@src/utils';

import {AuthServices} from '@src/pkg/authorizing/authorizing.services';
// import {logger} from '@src/utils/logger';
// import {exctractClientData} from '@src/utils/extract-client-data';
import {CacheServices} from '@src/pkg/cache/cache.services';

const sessionMiddleware: CustomRequestHandler = async (request, _, next) => {
  const {__sesson} = request.cookies;
  if (__sesson) {
    // try {
    let auth = await CacheServices.getSession(__sesson);
    if (auth) request.auth = auth;
    else {
      auth = await AuthServices().getSession({sessionToken: __sesson});
      request.auth = auth;
      await CacheServices.setSession({sessionToken: __sesson, ...auth});
    }
    // } catch (error) {
    // logger.info(exctractClientData(request) + ' is unauthorized');
    // }
  }
  next();
};

export const session = asyncWrapper(sessionMiddleware);
