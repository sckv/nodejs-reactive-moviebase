import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class CacheClearingFromError extends Error {
  data: {[k: string]: any};
  constructor({data}: ErrorProps) {
    super(ErrorsList.CACHE_CLEARING_FROM);
    this.message = ErrorsList.CACHE_CLEARING_FROM;
    this.data = data;
  }
}
