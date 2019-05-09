import {CustomRequestHandler} from 'types/utils';

export const errorsHandler: CustomRequestHandler = (request, response, next) => {
  try {
    next();
  } catch (e) {
    console.log('CATCHED ERROR', e);
  }
};
