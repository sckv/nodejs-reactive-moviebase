import {MongoClient} from 'mongodb';

const mongoUrl = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`;

export const connectToDatabase = async () => {
  let connection: MongoClient = null;
  const tryConnect = async () => {
    try {
      connection = await MongoClient.connect(mongoUrl, {loggerLevel: 'debug'});
      return connection;
    } catch (error) {
      console.log('Error with database connection');
    }
  };

  connection &&
    connection.on('error', () => {
      setTimeout(() => tryConnect(), 5000);
    });

  return connection;
};
