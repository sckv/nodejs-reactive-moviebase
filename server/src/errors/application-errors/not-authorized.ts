import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class NotAuthorizedError extends Error {
  data: ErrorProps['data'];
  code: number;
  constructor({code = 403, data, message = ErrorsList.NOT_AUTHORIZED}: ErrorProps) {
    super(message);
    this.data = data;
    this.code = code;
    // tslint:disable-next-line
    // logger.info(data.id + ' - ' + data.ip + ' tried to access protected route ' + data.url + 'with no authorization.');
  }
}
