import {mongoConnection} from '@src/database';

import {Db, ObjectId} from 'mongodb';
import {createObjectId} from '@src/utils/create-objectid';
import {ListsRepository} from '@src/pkg/storage/mongo/lists.repository';
import {ListEntry} from 'types/listing.services';
import {MongoObjectID} from 'types/utils';

// We let injectable mongoclientDB ONLY for testing purposes
export const ListingServices = async (mc?: Db) => {
  const ListsRepo = ListsRepository(mc || mongoConnection);
  // const UsersRepo = UsersRepository(connection);
  return {
    getByUserId: ({
      userId,
      selfId = null,
    }: {
      selfId: ObjectId | string | null;
      userId: ObjectId | string;
    }): Promise<ListEntry[]> => {
      return ListsRepo.getByUser<ListEntry>(createObjectId(userId), createObjectId(selfId));
    },
    get: ({
      listId,
      selfId = null,
    }: {
      selfId: ObjectId | string | null;
      listId: ObjectId | string;
    }): Promise<ListEntry> => {
      return ListsRepo.get(createObjectId(listId), createObjectId(selfId));
    },
    create: (listData: {title: string; description: string; isPrivate: boolean; selfId: MongoObjectID | ObjectId}) => {
      return ListsRepo.create({...listData, selfId: createObjectId(listData.selfId)});
    },
  };
};
