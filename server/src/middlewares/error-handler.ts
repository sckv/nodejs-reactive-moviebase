// import { CustomRequestHandler } from 'types/utils';
import { UserNotFoundError } from '@src/errors/domain-errors/user-not-found';
import { logger } from '@src/utils/logger';
import { InvalidEmailError } from '@src/errors/application-errors/invalid-email';
import { InvalidPasswordError } from '@src/errors/application-errors/invalid-password';
import { CustomRequestErrorHandler } from 'types/utils';
import { NotAuthorizedError } from '@src/errors/application-errors/not-authorized';

export const errorsHandler: CustomRequestErrorHandler = (err, _, response, __) => {
  logger.error('ERROR IS>>>', err);
  if (err) {
    const { data, message, code, constructor } = err;
    switch (constructor) {
      case UserNotFoundError:
        response.status(code || 404).send({ data, message });
        break;
      case InvalidEmailError:
        response.status(code || 400).send({ data, message });
        break;
      case InvalidPasswordError:
        response.status(code || 412).send({ data, message });
        break;
      case NotAuthorizedError:
        response.status(code || 401).send({ data, message });
        break;
      default:
        response.status(500).send(data || 'No Message');
    }
  }
};
