import {ErrorProps} from 'types/utils';

export class SessionAlreadyClosedError extends Error {
  code: number;
  constructor({code = 501, message}: ErrorProps) {
    super(message);
    this.code = code;
  }
}
