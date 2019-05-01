import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class SessionNotSetError extends Error {
  data: {[k: string]: any};
  constructor({data}: ErrorProps) {
    super(ErrorsList.SESSION_NOT_SET);
    this.message = ErrorsList.SESSION_NOT_SET;
    this.data = data;
  }
}
