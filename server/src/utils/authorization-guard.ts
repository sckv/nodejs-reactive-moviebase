import { CustomRequestHandler } from 'types/utils';
import { NotAuthorizedError } from '@src/errors/application-errors/not-authorized';

export const AuthRouteGuard = async (fn): Promise<CustomRequestHandler> => {
  return (req, res, next) => {
    if (!req.auth) throw new NotAuthorizedError({ data: { id: req.id, ip: req.ip, url: req.originalUrl } });
    return fn(req, res, next);
  };
};
