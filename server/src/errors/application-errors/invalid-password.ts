import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class InvalidPasswordError extends Error {
  data: ErrorProps['data'];

  constructor({data, message = ErrorsList.INVALID_PASSWORD}: ErrorProps) {
    super();
    this.data = data;
  }
}
