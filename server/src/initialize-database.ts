import {Db} from 'mongodb';

const collections = [{name: 'users'}, {name: 'movies'}, {name: 'sessions'}];

export const InitializeDatabase = async (db: Db) => {
  for (const {name} of collections) await db.createCollection(name);

  db.collection('users').createIndex({username: 1}, {unique: true});
  db.collection('users').createIndex({email: 1}, {unique: true});
};
