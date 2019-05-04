import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class ListModifyingError extends Error {
  data: {[k: string]: any};
  constructor({data}: ErrorProps) {
    super(ErrorsList.LIST_MODIFYING);
    this.message = ErrorsList.LIST_MODIFYING;
    this.data = data;
  }
}
