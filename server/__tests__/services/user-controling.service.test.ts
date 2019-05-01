import {Db, MongoClient} from 'mongodb';

import {connectToDatabase} from '../../src/database';
import {usersFixture} from '../fixtures/users.fixture';
import {moviesFixture} from '../fixtures/movies.fixture';

// Service & Repo
import {UserControllingServices} from '../../src/pkg/user-controlling/user-controlling.services';
import {UsersRepository} from '../../src/pkg/storage/mongo/users.repository';

type ThenArg<T> = T extends Promise<infer U> ? U : T;

jest.setTimeout(25000);

describe('<-- User control service / repository -->', () => {
  let database: Db;
  let connection: MongoClient;
  let repository: ReturnType<typeof UsersRepository>;
  let services: ThenArg<ReturnType<typeof UserControllingServices>>;

  beforeAll(async () => {
    const connect = await connectToDatabase();
    database = connect.db;
    connection = connect.connection;
    await database.collection('users').insertMany(usersFixture);

    repository = UsersRepository(database);
    services = await UserControllingServices(database);
  }, 5000);
  afterAll(async () => {
    await database.dropCollection('users');

    await connection.close();
  }, 1000);

  it('registers a user with right data / service', async () => {});

  it('do not registers a user with wrong email / service', async () => {});

  it('searches for users / repo', async () => {});

  it('searches for a single user / repo', async () => {});

  it('gets a user with followers and follows data / repo', async () => {});

  it('gets a user with lists and movies data / repo', async () => {});

  it('gets a user with private data / repo', async () => {});

  it('gets a user with full data / repo', async () => {});

  it('modifies user data / repo', async () => {});

  it('follows a user / repo', async () => {});

  it('unfollows a user / repo', async () => {});
});
