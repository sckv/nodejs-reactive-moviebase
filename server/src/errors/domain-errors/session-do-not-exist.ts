import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class SessionDoNotExistError extends Error {
  data: {[k: string]: any};
  constructor({data}: ErrorProps) {
    super(ErrorsList.SESSION_DO_NOT_EXIST);
    this.data = data;
  }
}
