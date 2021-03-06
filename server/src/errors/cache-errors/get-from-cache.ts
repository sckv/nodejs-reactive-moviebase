import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class CacheGettingFromError extends Error {
  data: {[k: string]: any};
  constructor({data}: ErrorProps) {
    super(ErrorsList.CACHE_GETTING_FROM);
    this.message = ErrorsList.CACHE_GETTING_FROM;
    this.data = data;
  }
}
