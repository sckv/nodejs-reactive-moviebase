import {MongoClient, Db} from 'mongodb';
import {logger} from '@src/utils/logger';
import {InitializeDatabase} from '@src/initialize-database';

const mongoUrl = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`;

export const connectToDatabase = async (): Promise<{db: Db; connection: MongoClient}> => {
  let connection: MongoClient = null;

  const tryConnect = async () => {
    try {
      connection = await MongoClient.connect(mongoUrl, {useNewUrlParser: true});
      await InitializeDatabase(connection.db('moviebase'));
      console.log('CONNECTED DATABASE', connection);
      return true;
    } catch (error) {
      logger.error('Error with database connection');
    }
  };
  const result = await tryConnect();
  connection &&
    connection.on('error', () => {
      setTimeout(async () => await tryConnect(), 5000);
    });
  if (result) {
    return {
      db: connection.db('moviebase'),
      connection,
    };
  }
};

export let mongoConnection: Db;
connectToDatabase().then(res => {
  console.log('resolving to mongoconnection', res);
  mongoConnection = res.db;
});

// export let mongoConnection = resolvedConnection;
