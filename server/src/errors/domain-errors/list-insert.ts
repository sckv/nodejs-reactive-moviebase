import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class ListInsertError extends Error {
  data: {[k: string]: any};
  constructor({data}: ErrorProps) {
    super(ErrorsList.LIST_INSERT);
    this.message = ErrorsList.LIST_INSERT;
    this.data = data;
  }
}
