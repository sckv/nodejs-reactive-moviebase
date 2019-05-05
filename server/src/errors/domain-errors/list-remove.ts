import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class ListRemoveError extends Error {
  data: {[k: string]: any};
  constructor({data}: ErrorProps) {
    super(ErrorsList.LIST_REMOVE);
    this.message = ErrorsList.LIST_REMOVE;
    this.data = data;
  }
}
