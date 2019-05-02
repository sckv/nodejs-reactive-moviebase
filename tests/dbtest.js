const {MongoClient} = require('mongodb');
const {usersFixture, moviesFixture, UserIDS} = require('./fixtures');
const {ObjectId} = require('bson');

const mongoUrl = `mongodb://localhost:27017/moviebase`;

const connectToDatabase = async () => {
  let connection = null;
  let db = null;
  const tryConnect = async () => {
    try {
      connection = await MongoClient.connect(mongoUrl, {useNewUrlParser: true});
      db = connection.db('moviebase');
      // await InitializeDatabase(db);
      // await db.dropCollection('users');
      // await db.dropCollection('movies');
      await db.createCollection('users');
      await db.collection('users').createIndex({email: 1}, {unique: true});

      await db.collection('users').insertMany(usersFixture);
      // await db.collection('users').createIndex({username: 'text'}, {unique: true});

      await db.collection('movies').insertMany(moviesFixture);
      return connection;
    } catch (error) {
      console.error('Error with database connection', error);
    }
  };
  await tryConnect();
  connection &&
    connection.on('error', () => {
      setTimeout(async () => await tryConnect(), 5000);
    });
  return {
    db,
    connection,
  };
};

const makeQuery = async () => {
  const {db} = await connectToDatabase();
  console.log('connected to db');

  // const sessions = await db
  //   .collection('sessions')
  //   .find({})
  //   .toArray();
  // console.log('sessions>>', sessions);

  const username = usersFixture[3].username;
  const securedUserId = db.collection('users').findOne(
    {$or: [{_id: UserIDS.user3}, {username}]},
    {
      projection: {
        _id: 1,
      },
    },
  );
  const success = await db
    .collection('users')
    .aggregate([
      {$match: {$or: [{_id: UserIDS.user3}, {username}]}},
      {
        $graphLookup: {
          from: 'users',
          connectFromField: 'follows',
          connectToField: '_id',
          startWith: '$follows',
          as: 'follows',
          maxDepth: 0,
        },
      },
      {
        $graphLookup: {
          from: 'users',
          connectFromField: 'followers',
          connectToField: '_id',
          startWith: '$followers',
          as: 'followers',
          maxDepth: 0,
        },
      },
      {
        $lookup: {
          from: 'movies',
          let: {ratedMovies: '$id'},
          as: 'ratedMovies',
          pipeline: [
            {
              $match: {'ratedBy.userId': UserIDS.user3},
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
        $addFields: {
          followers: {
            $map: {
              input: '$followers',
              as: 'follower',
              in: {
                _id: '$$follower._id',
                username: '$$follower.username',
              },
            },
          },
          follows: {
            $map: {
              input: '$follows',
              as: 'follow',
              in: {
                _id: '$$follow._id',
                username: '$$follow.username',
              },
            },
          },
          lists: {
            $map: {
              input: '$lists',
              as: 'list',
              in: {
                _id: '$$list._id',
                description: '$$list.description',
              },
            },
          },
        },
      },
    ])
    .next();
  console.log('susers>>', success);
};

makeQuery();
