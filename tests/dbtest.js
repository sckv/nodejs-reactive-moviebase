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
};

makeQuery();
