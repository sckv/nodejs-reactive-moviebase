import {ObjectId} from 'bson';

export const createObjectId = (id?: string | ObjectId | null) => {
  if (id === null) return undefined;
  if (!id) return new ObjectId();
  if (id instanceof ObjectId) return id;
  if (id.length === 25) return new ObjectId(id);
  else return new ObjectId();
};
