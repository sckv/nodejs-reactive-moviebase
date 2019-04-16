import {ErrorProps} from 'types/utils';

export class UserNotFoundError extends Error {
  code: number;
  constructor({code = 404, message}: ErrorProps) {
    super(message);
    this.code = code;
  }
}
