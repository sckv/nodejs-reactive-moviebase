import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class CacheSettingToError extends Error {
  data: {[k: string]: any};
  constructor({data}: ErrorProps) {
    super(ErrorsList.CACHE_SET_TO);
    this.message = ErrorsList.CACHE_SET_TO;
    this.data = data;
  }
}
