import {Db} from 'mongodb';

const collections = [{name: 'users'}, {name: 'movies'}, {name: 'sessions'}];

export const InitializeDatabase = async (db: Db) => {
  const dbCollections = await db.listCollections().toArray();
  for (const {name} of collections) {
    if (0 > dbCollections.findIndex(cl => cl.name === name)) {
      await db.createCollection(name);
    }
  }

  await db.collection('users').createIndex({username: 1}, {unique: true});
  await db.collection('users').createIndex({email: 1}, {unique: true});

  await db.collection('movies').createIndex({ttid: 1});
  await db.collection('movies').createIndex({year: 'text', title: 'text', data: 'text'}, {
    weights: {
      title: 10,
      data: 5,
    },
    name: 'TextIndex',
    default_language: 'english',
  } as any);
};
