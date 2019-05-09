import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class InvalidPasswordError extends Error {
  data: ErrorProps['data'];
  code: number;
  constructor({code = 403, data, message = ErrorsList.INVALID_PASSWORD}: ErrorProps) {
    super(message);
    this.data = data;
    this.code = code;
  }
}
