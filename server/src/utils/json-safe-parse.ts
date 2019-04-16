import {logger} from '@src/utils/logger';

export const jsonSafeParse = <T = {[k: string]: any}>(data: string): T | null => {
  try {
    return JSON.parse(data) as T;
  } catch (e) {
    //TODO: CHANGE FOR PINO LOGGER
    logger.info('Error parsing JSON', e);
    console.log('Error parsing JSON', e);
    return null;
  }
};
