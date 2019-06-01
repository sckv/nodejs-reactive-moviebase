import { Db, MongoClient, ObjectId } from 'mongodb';

import { connectToDatabase } from '../../src/database';
import { usersFixture } from '../fixtures/users.fixture';
import { moviesFixture } from '../fixtures/movies.fixture';
import { UserNotFoundError } from '../../src/errors/domain-errors/user-not-found';
import { InvalidEmailError } from '../../src/errors/application-errors/invalid-email';
import { UserRegisterError } from '../../src/errors/domain-errors/user-register';
// Service & Repo
import { UserControllingServices } from '../../src/pkg/user-controlling/user-controlling.services';
import { UsersRepository } from '../../src/pkg/storage/mongo/users.repository';
import { UserIDS } from '../fixtures/IDs';

type ThenArg<T> = T extends Promise<infer U> ? U : T;

jest.setTimeout(25000);

export default describe('<-- User control service / repository -->', () => {
  let database: Db;
  let connection: MongoClient;
  let repository: ReturnType<typeof UsersRepository>;
  let services: ThenArg<ReturnType<typeof UserControllingServices>>;

  beforeAll(async () => {
    const connect = await connectToDatabase();
    database = connect.connection.db('users-test');
    connection = connect.connection;

    await database.collection('users').insertMany(usersFixture);
    await database.collection('users').createIndex({ email: 1 }, { unique: true });
    await database.collection('users').createIndex({ username: 1 }, { unique: true });

    await database.collection('movies').insertMany(moviesFixture);

    repository = UsersRepository(database);
    services = await UserControllingServices(database);
  }, 5000);
  afterAll(async () => {
    await database.dropCollection('users');
    await database.dropCollection('movies');

    await connection.close();
  }, 2500);

  it('registers a user with right data / service', async () => {
    const testGuyObject = { username: 'testguy01', password: 'xxxx', email: 'nice@email.com' };
    const registered = await services.register(testGuyObject);

    const { username } = await services.get({ username: testGuyObject.username, selfId: usersFixture[0]._id });

    expect(registered).toBeTruthy();
    expect(username).toBe(testGuyObject.username);
  });

  it('do not registers a user with wrong email / service', async () => {
    const testGuyObject = { username: 'testguy02', password: 'xxxx', email: 'nice@sbit@email.com' };
    try {
      await services.register(testGuyObject);
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidEmailError);
    }

    try {
      await services.get({ username: testGuyObject.username, selfId: usersFixture[0]._id });
    } catch (e) {
      expect(e).toBeInstanceOf(UserNotFoundError);
    }
  });

  it('do not registers a user with the same email / service', async () => {
    const testGuyObject = { username: 'testguy02', password: 'xxxx', email: 'nice@email.com' };
    try {
      await services.register(testGuyObject);
    } catch (e) {
      expect(e).toBeInstanceOf(UserRegisterError);
    }

    try {
      await services.get({ username: testGuyObject.username, selfId: usersFixture[0]._id });
    } catch (e) {
      expect(e).toBeInstanceOf(UserNotFoundError);
    }
  });

  it('searches for users / repo', async () => {
    const results = await services.search({ username: 'guy0', page: 1 });
    expect(results.length).toBe(2);
  });

  it('searches for a single user / repo', async () => {
    const { _id, username } = usersFixture[0];
    const user = await repository.search<{ _id: ObjectId }>({ username });

    expect(user[0]._id).toEqual(_id);
  });

  it('gets a user with followers and follows data / repo', async () => {
    const data = await repository.get({
      userId: UserIDS.user3,
      selfId: UserIDS.user3,
      followers: true,
      follows: true,
    });

    expect(data).toEqual({
      _id: new ObjectId('5cc85a6a5e736fbf95f22149'),
      username: 'testguy3',
      followers: user3FullData.followers,
      follows: user3FullData.follows,
    });
  });

  it('gets a user with lists and movies data / repo', async () => {
    const data = await repository.get({
      userId: UserIDS.user3,
      selfId: UserIDS.user3,
      listsData: true,
      moviesData: true,
    });

    expect(data).toEqual({
      _id: new ObjectId('5cc85a6a5e736fbf95f22149'),
      username: 'testguy3',
      ratedMovies: user3FullData.ratedMovies,
      lists: user3FullData.lists,
    });
  });

  it('gets a user with private data / repo', async () => {
    const data = await repository.get({
      userId: UserIDS.user3,
      selfId: UserIDS.user3,
      personalData: true,
    });

    expect(data).toEqual({
      _id: new ObjectId('5cc85a6a5e736fbf95f22149'),
      username: 'testguy3',
      email: 'test3@email.com',
      language: 'en',
    });
  });

  it('gets a user with full data / repo', async () => {
    const data = await repository.get({
      userId: UserIDS.user3,
      selfId: UserIDS.user3,
      personalData: true,
      followers: true,
      follows: true,
      listsData: true,
      moviesData: true,
    });

    expect(data).toEqual(user3FullData);
  });

  it('follows a user / repo', async () => {
    const followSuccess = await repository.follow({ userId: usersFixture[0]._id, followId: usersFixture[4]._id });

    expect(followSuccess).toBeTruthy();

    const { follows } = await repository.get({
      username: usersFixture[0].username,
      selfId: usersFixture[0]._id,
      follows: true,
    });
    const { username, followers } = await repository.get({
      username: usersFixture[4].username,
      selfId: usersFixture[0]._id,
      followers: true,
    });

    const existInFollows = follows ? follows.find(fl => usersFixture[4]._id.equals(fl._id)) : follows;
    const existInFollowers = followers ? followers.find(fl => usersFixture[0]._id.equals(fl._id)) : followers;

    expect(username).toBe(usersFixture[4].username);
    expect(existInFollows).not.toBeUndefined();
    expect(existInFollowers).not.toBeUndefined();
  });

  it('unfollows a user / repo', async () => {
    const followSuccess = await repository.unfollow({ userId: usersFixture[3]._id, followId: usersFixture[5]._id });

    expect(followSuccess).toBeTruthy();

    const { follows } = await repository.get({
      userId: usersFixture[3]._id,
      selfId: usersFixture[3]._id,
      follows: true,
    });
    const { username, followers } = await repository.get({
      userId: usersFixture[5]._id,
      selfId: usersFixture[3]._id,
      followers: true,
    });

    const existInFollows = follows.find(fl => usersFixture[5]._id.equals(fl._id));
    const existInFollowers = followers.find(fl => usersFixture[3]._id.equals(fl._id));

    expect(username).toBe(usersFixture[5].username);
    expect(existInFollows).toBeUndefined();
    expect(existInFollowers).toBeUndefined();
  });
});

const user3FullData = {
  _id: new ObjectId('5cc85a6a5e736fbf95f22149'),
  username: 'testguy3',
  email: 'test3@email.com',
  language: 'en',
  follows: [
    { _id: new ObjectId('5cc85a7379079fb9b6380554'), username: 'testguy5' },
    { _id: new ObjectId('5cc85971bf674494253f9a11'), username: 'testguy2' },
  ],
  followers: [
    { _id: new ObjectId('5cc85a65cbe99c36e2bec3fa'), username: 'testguy0' },
    { _id: new ObjectId('5cc8587c2eceae102c1a8fdf'), username: 'testguy1' },
  ],
  ratedMovies: [
    {
      _id: new ObjectId('5cc85a9f68fe8abf3707f2df'),
      title: 'Movie 5 TEST',
      poster: 'Movie 5 ESP POSTER',
      comment: 'MOVIE 5 POR USER0',
      rate: 3,
    },
    {
      _id: new ObjectId('5cc85a960bdd8bcdc13c1098'),
      comment: 'MOVIE 3 POR USER1',
      title: 'Movie 3 TEST',
      poster: 'Movie 3 POSTER',
      rate: 5,
    },
  ],
  lists: [
    {
      _id: new ObjectId('5cc85aca12e4c481c02b3c54'),
      description: 'Test List 5 of User3 description',
      title: 'Test List 5 of User3',
    },
  ],
};
