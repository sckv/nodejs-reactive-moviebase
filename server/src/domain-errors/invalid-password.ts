import {ErrorProps} from 'types/utils';

export class InvalidPasswordError extends Error {
  code: number;
  constructor({code = 403, message}: ErrorProps) {
    super(message);
    this.code = code;
  }
}
