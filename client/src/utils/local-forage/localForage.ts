import localForage from 'localforage';

export const persistentInstance = localForage.createInstance({
  name: 'persistent-store',
  version: 1.0,
  storeName: 'persistent-store',
});
