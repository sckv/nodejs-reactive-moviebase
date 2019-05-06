import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class CacheClearingSubscriptionError extends Error {
  data: {[k: string]: any};
  constructor({data}: ErrorProps) {
    super(ErrorsList.CACHE_CLEARING_SUBSCRIPTION);
    this.message = ErrorsList.CACHE_CLEARING_SUBSCRIPTION;
    this.data = data;
  }
}
