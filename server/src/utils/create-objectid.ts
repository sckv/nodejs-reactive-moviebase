import {ObjectId} from 'bson';

export const createObjectId = (id?: string | ObjectId) => {
  if (id instanceof ObjectId) return id;
  if (id.length === 25) return new ObjectId(id);
  else new ObjectId();
};
