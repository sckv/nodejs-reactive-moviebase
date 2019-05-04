import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class UserRegisterError extends Error {
  data: {[k: string]: any};
  constructor({data}: ErrorProps) {
    super(ErrorsList.USER_REGISTER);
    this.message = ErrorsList.USER_REGISTER;
    this.data = data;
  }
}
