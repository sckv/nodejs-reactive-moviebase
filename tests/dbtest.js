// const {MongoClient} = require('mongodb');
// const {usersFixture, moviesFixture, UserIDS} = require('./fixtures');
// const {ObjectId} = require('bson');

// const mongoUrl = `mongodb://localhost:27017/moviebase`;

// const connectToDatabase = async () => {
//   let connection = null;
//   let db = null;
//   const tryConnect = async () => {
//     try {
//       connection = await MongoClient.connect(mongoUrl, {useNewUrlParser: true});
//       db = connection.db('moviebase');
// await InitializeDatabase(db);
// await db.dropCollection('users');
// await db.dropCollection('movies');

// await db.createCollection('users');
// await db.collection('users').createIndex({email: 1}, {unique: true});
// await db.collection('users').createIndex({username: 1}, {unique: true});

// await db.collection('users').insertMany(usersFixture);
// await db.collection('users').createIndex({username: 'text'}, {unique: true});

// await db.collection('movies').insertMany(moviesFixture);
// await db
//   .collection('movies')
//   .createIndex({year: 'text', title: 'text', data: 'text'}, {default_language: 'english'});
// await db.collection('movies').createIndex({ttid: 1}, {unique: true});

//       return connection;
//     } catch (error) {
//       console.error('Error with database connection', error);
//     }
//   };
//   await tryConnect();
//   connection &&
//     connection.on('error', () => {
//       setTimeout(async () => await tryConnect(), 5000);
//     });
//   return {
//     db,
//     connection,
//   };
// };

// const makeQuery = async () => {
//   const {db} = await connectToDatabase();
//   console.log('connected to db');

//   const success = await db
//     .collection('movies')
//     .aggregate([
//       {$match: {$text: {$search: 'Movie 2 ESP POSTER'}}},
// { $skip: page > 0 ? (page - 1) * pageSize : 0 },
// { $limit: pageSize },
//       {
//         $addFields: {
// plot: `$data.${language}.plot`,
// description: `$data.${language}.description`,
//           score: {$meta: 'textScore'},
//           averageRate: {
//             $avg: '$ratedBy.rate',
//           },
//         },
//       },
//       {$sort: {score: {$meta: 'textScore'}}},
//       {
//         $project: {
//           _id: 1,
//           ttid: 1,
//           title: 1,
//           year: 1,
//           poster: 1,
//           averageRate: 1,
//         },
//       },
//     ])
//     .toArray();
//   console.log(success);
// };

// makeQuery();
