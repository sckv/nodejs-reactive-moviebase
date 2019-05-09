import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class InvalidEmailError extends Error {
  data: ErrorProps['data'];
  code: number;
  constructor({code = 400, data, message = ErrorsList.INVALID_EMAIL}: ErrorProps) {
    super(message);
    this.data = data;
    this.code = code;
  }
}
