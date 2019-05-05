import {Db, MongoClient, ObjectId} from 'mongodb';

import {connectToDatabase} from '../../src/database';
import {usersFixture} from '../fixtures/users.fixture';
import {moviesFixture} from '../fixtures/movies.fixture';
import {UserNotFoundError} from '../../src/errors/domain-errors/user-not-found';
import {InvalidEmailError} from '../../src/errors/application-errors/invalid-email';
import {UserRegisterError} from '../../src/errors/domain-errors/user-register';
// Service & Repo
import {UserControllingServices} from '../../src/pkg/user-controlling/user-controlling.services';
import {UsersRepository} from '../../src/pkg/storage/mongo/users.repository';
import {UserIDS} from '../fixtures/IDs';

type ThenArg<T> = T extends Promise<infer U> ? U : T;

jest.setTimeout(25000);

export default describe('<-- Movies control service / repository -->', () => {
  let database: Db;
  let connection: MongoClient;
  let repository: ReturnType<typeof UsersRepository>;
  let services: ThenArg<ReturnType<typeof UserControllingServices>>;

  beforeAll(async () => {
    const connect = await connectToDatabase();
    database = connect.connection.db('movies-test');
    connection = connect.connection;

    await database.collection('users').insertMany(usersFixture);
    await database.collection('users').createIndex({email: 1}, {unique: true});
    await database.collection('users').createIndex({username: 1}, {unique: true});

    await database.collection('movies').insertMany(moviesFixture);

    repository = UsersRepository(database);
    services = await UserControllingServices(database);
  }, 5000);
  afterAll(async () => {
    await database.dropCollection('users');
    await database.dropCollection('movies');

    await connection.close();
  }, 2500);

  it('unfollows a user / repo', async () => {});
});
