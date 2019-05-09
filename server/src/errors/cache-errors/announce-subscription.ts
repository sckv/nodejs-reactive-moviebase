import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class CacheAnnounceSubscriptionError extends Error {
  data: {[k: string]: any};
  constructor({data}: ErrorProps) {
    super(ErrorsList.CACHE_ANNOUNCE_SUBSCRIPTION);
    this.message = ErrorsList.CACHE_ANNOUNCE_SUBSCRIPTION;
    this.data = data;
  }
}
