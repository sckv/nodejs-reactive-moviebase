import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class UserNotFoundError extends Error {
  data: {[k: string]: any};
  constructor({data}: ErrorProps) {
    super(ErrorsList.USER_NOT_FOUND);
    this.data = data;
  }
}
