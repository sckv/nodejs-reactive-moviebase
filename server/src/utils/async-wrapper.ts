import { CustomRequestHandler } from 'types/utils';

export const asyncWrapper = (fn): CustomRequestHandler => {
  return async (req, res, next) => {
    if (fn instanceof Promise) {
      const awaited = await fn;
      awaited(req, res, next).catch(e => {
        next(e);
      });
    } else
      fn(req, res, next).catch(e => {
        next(e);
      });
  };
};
