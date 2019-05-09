import {CustomRequest} from 'types/utils';

export const exctractClientData = (request: CustomRequest) => {
  return {
    id: request.id,
    ip: request.ip,
    url: request.originalUrl,
    method: request.method,
    userAgent: request.get('user-agent'),
  };
};
