import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class ListNotFoundError extends Error {
  data: {[k: string]: any};
  constructor({data}: ErrorProps) {
    super(ErrorsList.LIST_NOT_FOUND);
    this.message = ErrorsList.LIST_NOT_FOUND;
    this.data = data;
  }
}
