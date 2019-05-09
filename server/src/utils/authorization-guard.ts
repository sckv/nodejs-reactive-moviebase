import {CustomRequestHandler} from 'types/utils';
import {NotAuthorizedError} from '@src/errors/application-errors/not-authorized';

export const AuthRouteGuard = (fn): CustomRequestHandler => {
  return (req, res, next) => {
    if (!req.auth) throw new NotAuthorizedError({data: {id: req.id, ip: req.ip, url: req.originalUrl}});
    fn(req, res, next);
  };
};
