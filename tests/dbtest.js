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
      // await db.collection('movies').createIndex({ttid: 1}, {unique: true});

      // await db.createCollection('users');
      // await db.collection('users').createIndex({email: 1}, {unique: true});
      // await db.collection('users').createIndex({username: 1}, {unique: true});

      // await db.collection('users').insertMany(usersFixture);
      // await db.collection('users').createIndex({username: 'text'}, {unique: true});

      // await db.collection('movies').insertMany(moviesFixture);
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

  const success = await db
    .collection('users')
    .aggregate([
      {$match: {_id: usersFixture[0]._id}},
      {
        $project: {
          title: 1,
          description: 1,
          private: 1,
          list: {
            $filter: {
              input: '$lists',
              as: 'list',
              cond: {$eq: ['$$list._id', usersFixture[0].lists[0]._id]},
            },
          },
        },
      },
      {$unwind: '$list'},
      {
        $lookup: {
          from: 'movies',
          let: {
            movies: '$$CURRENT.list.movies',
            userId: '$$CURRENT._id',
          },
          as: 'list.movies',
          pipeline: [
            {
              $match: {
                $expr: {$in: ['$_id', '$$movies']},
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
        $project: {
          _id: '$list._id',
          // lists: 1,
          title: '$list.title',
          description: '$list.description',
          private: '$list.private',
          movies: '$list.movies',
        },
      },
    ])
    .next();
  console.log(success);
};

makeQuery();
