import { mongoConnection } from '@src/database';

import { Db, ObjectId } from 'mongodb';
import { createObjectId } from '@src/utils/create-objectid';
import { ListsRepository } from '@src/pkg/storage/mongo/lists.repository';
import { ListEntry } from 'types/listing.services';
import { MongoObjectID } from 'types/utils';
import { CreateListObject, AddMovieToListObject } from 'types/lists.repository';
import { Omit } from 'utility-types';

// We let injectable mongoclientDB ONLY for testing purposes
export const ListingServices = (mc?: Db) => {
  const ListsRepo = ListsRepository(mc || mongoConnection);
  return {
    getByUserId: ({
      userId,
      selfId = null,
    }: {
      selfId: ObjectId | MongoObjectID | null;
      userId: ObjectId | MongoObjectID;
    }): Promise<ListEntry[]> => {
      return ListsRepo.getByUser<ListEntry>(createObjectId(userId), createObjectId(selfId));
    },
    get: ({
      listId,
      selfId = null,
    }: {
      selfId?: ObjectId | MongoObjectID | null;
      listId: ObjectId | MongoObjectID;
    }): Promise<ListEntry> => {
      return ListsRepo.get(createObjectId(listId), createObjectId(selfId));
    },
    create: (listData: {
      title: string;
      description: string;
      isPrivate: boolean;
      selfId: MongoObjectID | ObjectId;
    }) => {
      return ListsRepo.create({ ...listData, selfId: createObjectId(listData.selfId) });
    },
    modify: (
      listData: { listId: ObjectId | MongoObjectID; selfId: ObjectId | MongoObjectID } & Partial<
        Omit<CreateListObject, 'userId'>
      >,
    ) => {
      return ListsRepo.modify({
        ...listData,
        selfId: createObjectId(listData.selfId),
        listId: createObjectId(listData.listId),
      });
    },
    delete: ({ listId, selfId }: { listId: ObjectId | MongoObjectID; selfId: ObjectId | MongoObjectID }) => {
      return ListsRepo.delete(createObjectId(listId), createObjectId(selfId));
    },
    addMovie: ({
      listId,
      selfId,
      movieId,
      ...other
    }: AddMovieToListObject & {
      selfId: ObjectId | MongoObjectID;
      listId: ObjectId | MongoObjectID;
    }) => {
      return ListsRepo.addMovie({
        ...other,
        movieId: createObjectId(movieId),
        listId: createObjectId(listId),
        selfId: createObjectId(selfId),
      });
    },
    removeMovie: ({
      listId,
      selfId,
      movieId,
    }: {
      selfId: ObjectId | MongoObjectID;
      listId: ObjectId | MongoObjectID;
      movieId: ObjectId | MongoObjectID;
    }) => {
      return ListsRepo.removeMovie({
        movieId: createObjectId(movieId),
        listId: createObjectId(listId),
        selfId: createObjectId(selfId),
      });
    },
  };
};
