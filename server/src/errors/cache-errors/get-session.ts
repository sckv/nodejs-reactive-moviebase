import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class CacheGettingSessionError extends Error {
  data: {[k: string]: any};
  constructor({data}: ErrorProps) {
    super(ErrorsList.CACHE_GETTING_SESSION);
    this.message = ErrorsList.CACHE_GETTING_SESSION;
    this.data = data;
  }
}
