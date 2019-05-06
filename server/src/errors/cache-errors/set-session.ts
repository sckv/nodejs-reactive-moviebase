import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class CacheSettingSessionError extends Error {
  data: {[k: string]: any};
  constructor({data}: ErrorProps) {
    super(ErrorsList.CACHE_SETTING_SESSION);
    this.message = ErrorsList.CACHE_SETTING_SESSION;
    this.data = data;
  }
}
