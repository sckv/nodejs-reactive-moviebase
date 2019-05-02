import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class UserModifyingError extends Error {
  data: {[k: string]: any};
  constructor({data}: ErrorProps) {
    super(ErrorsList.USER_MODIFYING_ERROR);
    this.message = ErrorsList.USER_MODIFYING_ERROR;
    this.data = data;
  }
}
