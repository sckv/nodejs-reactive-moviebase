export type GetFromLocalForage = {
  getArrayFromStorage<T>(instance: LocalForage): Promise<T[]>;
};

export const getArrayFromStorage = async <T>(instance: LocalForage): Promise<T[]> => {
  const keys = await instance.keys();
  const arr: T[] = [];
  for (const key of keys) {
    const item = await instance.getItem(key);
    arr.push(item as any);
  }
  return arr;
};

export const getObjectFromStorage = async <T extends {[k: string]: any}>(instance: LocalForage): Promise<T> => {
  const keys = await instance.keys();
  const obj: T = {} as T;
  for (const key of keys) {
    const item = await instance.getItem(key);
    Object.defineProperty(obj, key, {value: item, enumerable: true});
  }
  return obj;
};
