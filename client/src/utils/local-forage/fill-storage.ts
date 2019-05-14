import isPlainObject from 'lodash/isPlainObject';

export const fillStorage = async (instance: LocalForage, data: any) => {
  if (isPlainObject(data)) {
    for (const val in data) {
      if (data[val]) {
        try {
          await instance.setItem(val, data[val]);
        } catch (err) {
          console.log(`Error filling ${instance.config.name} with>> ${val}`);
        }
      }
    }
  } else if (Array.isArray(data)) {
    for (const val of data)
      if (val) {
        try {
          await instance.setItem(val[Object.keys(val)[0]], val);
        } catch (err) {
          console.log(`Error filling ${instance.config.name} with>> ${val}`);
        }
      }
  } else console.log('wtf is this entity to storage', instance, data);
};
