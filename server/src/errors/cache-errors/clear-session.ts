import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class CacheClearingSessionError extends Error {
  data: {[k: string]: any};
  constructor({data}: ErrorProps) {
    super(ErrorsList.CACHE_CLEARING_SESSION);
    this.message = ErrorsList.CACHE_CLEARING_SESSION;
    this.data = data;
  }
}
