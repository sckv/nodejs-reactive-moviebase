import {Omit} from 'utility-types';
import {Db} from 'mongodb';
import {ObjectId} from 'bson';
import {CreateListObject, AddMovieToListObject, RemoveMovieObject} from 'types/lists.repository';
import {UserNotFoundError} from '@src/errors/domain-errors/user-not-found';
import {logger} from '@src/utils/logger';
import {ListInsertError} from '@src/errors/domain-errors/list-insert';
import {User} from 'types/User.model';
import {createObjectId} from '@src/utils/create-objectid';
import {ListModifyingError} from '@src/errors/domain-errors/list-modify';
import {MovieNotFoundError} from '@src/errors/domain-errors/movie-not-found';
import {AddingMovieToListError} from '@src/errors/domain-errors/list-add-movie';
import {RemovingMovieFromListError} from '@src/errors/domain-errors/list-remove-movie';
import {ListNotFoundError} from '@src/errors/domain-errors/list-not-found';

const LIMIT_PAGINATION = 30;

export const ListsRepository = (db: Db) => {
  return {
    getByUser: async <T>(userId: ObjectId, selfId?: ObjectId): Promise<T[]> => {
      // initial aggregation object
      const aggregationPipeline: any[] = [
        {$match: {_id: userId}},
        {
          $project: {
            title: 1,
            description: 1,
            private: 1,
            lists: 1,
          },
        },
        {$unwind: '$lists'},
        {
          // we limit an array of retrieved movies to `LIMIT_PAGINATION`
          $addFields: {
            'lists.movies': {$slice: ['$lists.movies', LIMIT_PAGINATION]},
          },
        },
      ];

      // we skipe private movies if it is another user
      if (!selfId || !userId.equals(selfId)) aggregationPipeline.push({$match: {'lists.private': false}});

      // we join with 'movies' and unwrap movieIds to meaningful data
      aggregationPipeline.push(
        {
          $lookup: {
            from: 'movies',
            let: {
              movies: '$$CURRENT.lists.movies',
              userId: '$$CURRENT._id',
            },
            as: 'lists.movies',
            pipeline: [
              {
                $match: {
                  $expr: {
                    $cond: {
                      if: {$ne: ['$$movies', null]},
                      then: {$in: ['$_id', '$$movies']},
                      else: {$ne: ['$_id', 0]},
                    },
                  },
                },
              },
              {
                // filter the movies rated only by that user
                $addFields: {
                  ratedBy: {
                    $filter: {
                      input: '$ratedBy',
                      as: 'rate',
                      cond: {$eq: ['$$rate.userId', '$$userId']},
                    },
                  },
                },
              },
              {$unwind: '$ratedBy'},
              {
                $project: {
                  _id: '$_id',
                  title: '$title',
                  poster: '$poster',
                  rate: '$ratedBy.rate',
                },
              },
            ],
          },
        },
        {
          $group: {
            _id: '$_id',
            lists: {$push: '$lists'},
          },
        },
      );
      const lists = await db
        .collection<{lists: T[]}>('users')
        .aggregate(aggregationPipeline)
        .next();

      return lists.lists;
    },
    get: async <T>(listId: ObjectId, selfId?: ObjectId): Promise<T> => {
      // if (selfId) initialMatcher._id = selfId;

      const userOfList = await db
        .collection('users')
        .findOne<{_id: ObjectId}>({'lists._id': listId}, {projection: {_id: 1}});

      if (!userOfList) throw new ListNotFoundError({data: {listId}});
      const {_id} = userOfList;

      // initial aggregation object
      const aggregationPipeline: any[] = [
        {$match: {'lists._id': listId}},
        {
          $project: {
            title: 1,
            description: 1,
            private: 1,
            list: {
              $filter: {
                input: '$lists',
                as: 'list',
                cond: {$eq: ['$$list._id', listId]},
              },
            },
          },
        },
        {$unwind: '$list'},
      ];

      // we skipe private movies if it is another user
      if (!selfId || !_id.equals(selfId)) aggregationPipeline.push({$match: {'list.private': false}});

      // we join with 'movies' and unwrap movieIds to meaningful data
      aggregationPipeline.push(
        {
          $lookup: {
            from: 'movies',
            let: {
              // get variables for this pipeline
              // $$CURRENT refers to a current document being processed
              movies: '$$CURRENT.list.movies',
              userId: '$$CURRENT._id',
            },
            as: 'list.movies',
            pipeline: [
              {
                $match: {
                  $and: [{$expr: {$in: ['$_id', '$$movies']}}],
                },
              },
              {
                // filter the movies rated only by that user
                $addFields: {
                  ratedBy: {
                    $filter: {
                      input: '$ratedBy',
                      as: 'rate',
                      cond: {$eq: ['$$rate.userId', '$$userId']},
                    },
                  },
                },
              },
              {$unwind: '$ratedBy'},
              {
                $project: {
                  _id: '$_id',
                  title: '$title',
                  poster: '$poster',
                  rate: '$ratedBy.rate',
                },
              },
              {
                $group: {
                  _id: '$_id',
                  title: {$first: '$title'},
                  poster: {$first: '$poster'},
                  rate: {$first: '$rate'},
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: '$list._id',
            title: '$list.title',
            description: '$list.description',
            private: '$list.private',
            movies: '$list.movies',
          },
        },
      );
      const list = await db
        .collection<T>('users')
        .aggregate(aggregationPipeline)
        .next();

      return list;
    },
    create: async ({description, isPrivate, title, selfId}: CreateListObject): Promise<boolean> => {
      try {
        const inserted = await db.collection<Partial<User>>('users').updateOne(
          {
            _id: selfId,
          },
          {
            $addToSet: {lists: {_id: createObjectId(), title, private: isPrivate, description, movies: []}},
            $currentDate: {
              lastModified: true,
              createdAt: {$type: 'timestamp'},
            },
          },
          {upsert: true},
        );

        if (!inserted.modifiedCount) throw new UserNotFoundError({data: {selfId}});
        return true;
      } catch (error) {
        console.log('Error creating list', error);
        logger.error('Error creating list', error);
        throw new ListInsertError({data: {description, isPrivate, title, selfId}});
      }
    },
    modify: async (
      listData: {listId: ObjectId; selfId: ObjectId} & Partial<Omit<CreateListObject, 'userId'>>,
    ): Promise<boolean> => {
      const {description, isPrivate, listId, selfId, title} = listData;
      const updateObject = {};
      if (description) updateObject['lists.$[lists].description'] = description;
      if (typeof isPrivate === 'boolean') updateObject['lists.$[lists].private'] = isPrivate;
      if (title) updateObject['lists.$[lists].title'] = title;

      try {
        const updated = await db.collection('users').updateOne(
          {_id: selfId},
          {
            $set: updateObject,
            $currentDate: {
              lastModified: true,
            },
          },
          {
            arrayFilters: [
              {
                'lists._id': {$eq: listId},
              },
            ],
          },
        );
        if (!updated.matchedCount) throw new UserNotFoundError({data: {listData}});
        if (!updated.modifiedCount)
          throw new ListModifyingError({
            data: {
              description,
              isPrivate,
              listId,
              title,
            },
          });
        return true;
      } catch (error) {
        logger.error('Error creating list', error);
        throw new ListModifyingError({data: {description, isPrivate, title, selfId}});
      }
    },
    delete: async (listId: ObjectId, selfId: ObjectId): Promise<boolean> => {
      try {
        const removed = await db.collection('users').updateOne(
          {_id: selfId},
          {
            $pull: {lists: {_id: listId}},
            $currentDate: {
              lastModified: true,
            },
          },
        );

        if (!removed.matchedCount) throw new UserNotFoundError({data: {selfId}});
        if (!removed.modifiedCount)
          throw new ListModifyingError({
            data: {
              listId,
              selfId,
            },
          });
        return true;
      } catch (error) {
        logger.error('Error creating list', error);
        throw new ListModifyingError({
          data: {
            listId,
            selfId,
          },
        });
      }
    },
    addMovie: async ({commentary, listId, movieId, rate, selfId}: AddMovieToListObject): Promise<boolean> => {
      const inserted = await db.collection('movies').updateOne(
        {_id: movieId},
        {
          $addToSet: {
            ratedBy: {
              userId: selfId,
              comment: commentary,
              rate,
            },
          },
          $currentDate: {
            lastModified: true,
          },
        },
      );

      if (!inserted.modifiedCount)
        // logger.error('Error adding movie, movie not modified', {movieId, rate, commentary});
        throw new MovieNotFoundError({data: {movieId}});
      // }

      const addToList = await db.collection('users').updateOne(
        {_id: selfId},
        {
          $addToSet: {
            'lists.$[lists].movies': movieId,
          },
          $currentDate: {
            lastModified: true,
          },
        },
        {
          arrayFilters: [{'lists._id': {$eq: listId}}],
        },
      );

      if (!addToList.modifiedCount)
        // logger.error('Error adding movie, movie not added to the list', {movieId, listId, selfId});
        throw new AddingMovieToListError({data: {listId, movieId, selfId}});
      return true;
    },
    removeMovie: async ({listId, movieId, selfId}: RemoveMovieObject): Promise<boolean> => {
      const removed = await db.collection('users').updateOne(
        {_id: selfId},
        {
          $pull: {'lists.$[lists].movies': movieId},
          $currentDate: {
            lastModified: true,
          },
        },
        {arrayFilters: [{'lists._id': {$eq: listId}}]},
      );
      if (!removed.modifiedCount) throw new RemovingMovieFromListError({data: {listId, movieId, selfId}});
      return true;
    },
  };
};
