import {CustomRequestHandler} from 'types/utils';

export const asyncWrapper = (fn): CustomRequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch(e => {
      next(e);
    });
  };
};
