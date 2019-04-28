import {MongoClient, Db} from 'mongodb';
import {logger} from '@src/utils/logger';

const mongoUrl = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`;

const connectToDatabase = async (): Promise<Db> => {
  let connection: MongoClient = null;

  const tryConnect = async () => {
    try {
      connection = await MongoClient.connect(mongoUrl, {loggerLevel: 'debug'});
      return connection;
    } catch (error) {
      logger.error('Error with database connection');
    }
  };

  connection &&
    connection.on('error', () => {
      setTimeout(async () => await tryConnect(), 5000);
    });

  return connection.db('moviebase');
};

let resolvedConnection: Db;
connectToDatabase().then(res => (resolvedConnection = res));

export const mongoConnection = resolvedConnection;
