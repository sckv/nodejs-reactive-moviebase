import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class FollowingOperationError extends Error {
  data: {[k: string]: any};
  constructor({data}: ErrorProps) {
    super(ErrorsList.FOLLOWING_OPERATION);
    this.message = ErrorsList.FOLLOWING_OPERATION;
    this.data = data;
  }
}
