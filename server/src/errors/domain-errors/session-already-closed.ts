import {ErrorProps, ExtendedError} from 'types/utils';

export class SessionAlreadyClosedError extends Error {
  data: {[k: string]: any};
  constructor({message, data}: ErrorProps) {
    super(message);
    this.data = data;
  }
}
