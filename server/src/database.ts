import { MongoClient, Db } from 'mongodb';
// import {logger} from '@src/utils/logger';
// import {InitializeDatabase} from '@src/initialize-database';

const mongoUrl = `mongodb://${process.env.MONGO_HOST || 'localhost'}:${process.env.MONGO_PORT || 27017}/${process.env
  .MONGO_DATABASE || 'moviebase'}`;

export const connectToDatabase = async (): Promise<{ db: Db; connection: MongoClient }> => {
  let connection: MongoClient = null;
  const configOptions: any = { useNewUrlParser: true };
  if (process.env.NODE_ENV !== 'test') configOptions.replicaSet = 'rs';
  const tryConnect = async () => {
    try {
      connection = (await MongoClient.connect(mongoUrl, configOptions)) as any;
      console.log('CONNECTED TO DATABASE');

      return true;
    } catch (error) {
      console.error('Error with database connection', error);
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
  mongoConnection = res.db;
});
