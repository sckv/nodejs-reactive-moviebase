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

const user3FullData = {
  _id: new ObjectId('5cc85a6a5e736fbf95f22149'),
  username: 'testguy3',
  email: 'test3@email.com',
  language: 'en',
  follows: [
    {_id: new ObjectId('5cc85a7379079fb9b6380554'), username: 'testguy5'},
    {_id: new ObjectId('5cc85971bf674494253f9a11'), username: 'testguy2'},
  ],
  followers: [
    {_id: new ObjectId('5cc85a65cbe99c36e2bec3fa'), username: 'testguy0'},
    {_id: new ObjectId('5cc8587c2eceae102c1a8fdf'), username: 'testguy1'},
  ],
  ratedMovies: [
    {_id: new ObjectId('5cc85a9f68fe8abf3707f2df'), title: 'Movie 5 TEST', poster: 'Movie 5 ESP POSTER', rate: 3},
    {_id: new ObjectId('5cc85a960bdd8bcdc13c1098'), title: 'Movie 3 TEST', poster: 'Movie 3 POSTER', rate: 5},
  ],
  lists: [{_id: new ObjectId('5cc85aca12e4c481c02b3c54'), description: 'Test List 5 of User3 description'}],
};
