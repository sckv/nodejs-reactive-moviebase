import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class SessionAlreadyClosedError extends Error {
  data: {[k: string]: any};
  constructor({data}: ErrorProps) {
    super(ErrorsList.SESSION_ALREADY_CLOSED);
    this.message = ErrorsList.SESSION_ALREADY_CLOSED;
    this.data = data;
  }
}
