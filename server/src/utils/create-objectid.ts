import {ObjectId} from 'bson';

export const createObjectId = (id?: string | ObjectId | null) => {
  if (id instanceof ObjectId) return id;
  if (id.length === 25) return new ObjectId(id);
  if (id === null) return undefined;
  else new ObjectId();
};
