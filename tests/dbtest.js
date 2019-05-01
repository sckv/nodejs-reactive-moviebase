const {MongoClient} = require('mongodb');
const {usersFixture, moviesFixture} = require('./fixtures');

const mongoUrl = `mongodb://localhost:27017/moviebase`;

const collections = [{name: 'users'}, {name: 'movies'}, {name: 'sessions'}];

const InitializeDatabase = async db => {
  for (const {name} of collections) await db.createCollection(name);
};

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
      // await db.collection('users').insertMany(usersFixture);
      // await db.collection('movies').insertMany(moviesFixture);
      return connection;
    } catch (error) {
      console.error('Error with database connection');
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

const SESSION_TEST_TOKEN = 'TESTSESSIONTOKEN-X';

const makeQuery = async () => {
  const {db} = await connectToDatabase();
  console.log('connected to db');

  // const sessions = await db
  //   .collection('sessions')
  //   .find({})
  //   .toArray();
  // console.log('sessions>>', sessions);

  const success = await db.collection('sessions').updateOne(
    {
      $and: [{token: {$eq: SESSION_TEST_TOKEN}}, {sessionClosed: {$exists: false}}],
    },
    {
      $currentDate: {
        lastModified: true,
        createdAt: {$type: 'timestamp'},
        sessionClosed: {$type: 'timestamp'},
      },
    },
  );
  console.log('success>>', success);
};

makeQuery();
