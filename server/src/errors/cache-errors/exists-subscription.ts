import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class CacheExistSubscriptionError extends Error {
  data: {[k: string]: any};
  constructor({data}: ErrorProps) {
    super(ErrorsList.CACHE_EXISTS_SUBSCRIPTION);
    this.message = ErrorsList.CACHE_EXISTS_SUBSCRIPTION;
    this.data = data;
  }
}
