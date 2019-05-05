import {Db} from 'mongodb';

const collections = [{name: 'users'}, {name: 'movies'}, {name: 'sessions'}];

export const InitializeDatabase = async (db: Db) => {
  for (const {name} of collections) await db.createCollection(name);

  await db.collection('users').createIndex({username: 1}, {unique: true});
  await db.collection('users').createIndex({email: 1}, {unique: true});

  await db.collection('movies').createIndex({ttid: 1});
  await db.collection('movies').createIndex({title: 'text'}, {default_language: 'english'});
};
