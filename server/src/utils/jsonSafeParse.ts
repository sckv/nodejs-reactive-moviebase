export const jsonSafeParse = <T = {[k: string]: any}>(data: string): T | null => {
  try {
    return JSON.parse(data) as T;
  } catch (e) {
    //TODO: CHANGE FOR PINO LOGGER
    console.log('Error parsing JSON', e);
    return null;
  }
};
