import {env} from '@src/global/env';
import {persistentInstance} from '@src/utils/local-forage';

export const saveState = (state: {}) => {
  persistentInstance
    .setItem('state', state)
    .then(() => {
      if (env === 'development') console.log('Saved state');
    })
    .catch(err => {
      if (env === 'development') console.log('!!!!!Didnt save the state', err);
    });
};

export const loadState = async (): Promise<{} | undefined> => {
  try {
    return await persistentInstance.getItem('state');
  } catch (err) {
    throw new Error(err);
  }
};
