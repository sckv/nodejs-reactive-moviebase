import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class InvalidEmailError extends Error {
  data: ErrorProps['data'];

  constructor({data, message = ErrorsList.INVALID_EMAIL}: ErrorProps) {
    super(message);
    this.data = data;
  }
}
