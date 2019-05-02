import {Db, MongoClient, ObjectId} from 'mongodb';

import {connectToDatabase} from '../../src/database';
import {usersFixture} from '../fixtures/users.fixture';
import {moviesFixture} from '../fixtures/movies.fixture';

// Service & Repo
import {AuthServices} from '../../src/pkg/authorizing/authorizing.services';
import {AuthRepository} from '../../src/pkg/storage/mongo/auth.repository';
import {UsersRepository} from '../../src/pkg/storage/mongo/users.repository';
import {UserControllingServices} from '../../src/pkg/user-controlling/user-controlling.services';
import {UserIDS} from '../fixtures/IDs';

type ThenArg<T> = T extends Promise<infer U> ? U : T;

jest.setTimeout(25000);

const SESSION_TEST_TOKEN = 'TESTSESSIONTOKEN-X';
const ACTIVATION_TEST_TOKEN = 'TESTACTIVATIONTOKEN-X';
const RECOVERY_TEST_TOKEN = 'TESTRECOVERYTOKEN-X';
const RESET_TEST_TOKEN = 'TESTRESETTOKEN-X';
describe('Testing services...', () => {
  describe('<-- Authorizing service / repository -->', () => {
    let database: Db;
    let connection: MongoClient;
    let repository: ReturnType<typeof AuthRepository>;
    let services: ThenArg<ReturnType<typeof AuthServices>>;

    beforeAll(async () => {
      const connect = await connectToDatabase();
      database = connect.db;
      connection = connect.connection;
      await database.collection('users').insertMany(usersFixture);
      await database.collection('users').createIndex({email: 1}, {unique: true});
      await database.collection('users').createIndex({username: 1}, {unique: true});
      await database.collection('movies').insertMany(moviesFixture);
      repository = AuthRepository(database);
      services = await AuthServices(database);
    }, 5000);
    afterAll(async () => {
      await database.dropCollection('users');
      await database.dropCollection('movies');
      await database.dropCollection('sessions');

      await connection.close();
    }, 2500);

    it('gets password by username / repo', async () => {
      const user0 = usersFixture[0];
      const {password} = await repository.getPasswordByUsername(user0.username);
      expect(password).toEqual(user0.password);
    });

    it('sets session / repo', async () => {
      const user1 = usersFixture[1];
      const {userId} = await repository.setSession({username: user1.username, sessionToken: SESSION_TEST_TOKEN});
      expect(String(userId)).toEqual(String(user1._id.toHexString()));
    });

    it('gets session / repo', async () => {
      const user1 = usersFixture[1];
      const session = await repository.getSession(SESSION_TEST_TOKEN);
      expect(String(session.userId)).toEqual(String(user1._id.toHexString()));
      expect(session.username).toEqual(user1.username);
      expect(session.language).toEqual(user1.language);
    });

    it('closes session / repo', async () => {
      const closed = await repository.closeSession(SESSION_TEST_TOKEN);
      expect(closed).toBeTruthy();
    });

    it('sets activation public token / repo', async () => {
      const user2 = usersFixture[2];
      const {activationToken} = await repository.setActivationPublicToken({
        userId: user2._id,
        activationToken: ACTIVATION_TEST_TOKEN,
      });
      expect(activationToken).toEqual(ACTIVATION_TEST_TOKEN);
    });

    it('activates user / repo', async () => {
      const activation = await repository.activate(ACTIVATION_TEST_TOKEN);
      expect(activation).toBeTruthy();
    });

    it('sets recovery public token / repo', async () => {
      const user0 = usersFixture[0];
      const {recoveryToken} = await repository.setRecoveryPublicToken({
        recoveryToken: RECOVERY_TEST_TOKEN,
        email: user0.email,
      });
      expect(recoveryToken).toEqual(RECOVERY_TEST_TOKEN);
    });

    it('matches recovery and sets reset token / repo', async () => {
      const {resetToken} = await repository.matchRecoveryAndSetResetToken({
        recoveryToken: RECOVERY_TEST_TOKEN,
        resetToken: RESET_TEST_TOKEN,
      });

      expect(resetToken).toEqual(RESET_TEST_TOKEN);
    });

    it('set password with reset token / repo', async () => {
      const password = 'CHANGEDTESTPASSWORD';
      const user0 = usersFixture[0];

      const passwordSet = await repository.setPassword({resetToken: RESET_TEST_TOKEN, password});
      expect(passwordSet).toBeTruthy();

      const updatedPassword = await repository.getPasswordByUsername(user0.username);
      expect(updatedPassword.password).toEqual(password);
    });

    it('set password with userId / repo', async () => {
      const password = 'CHANGEDTESTPASSWORD';
      const user3 = usersFixture[3];

      const passwordSet = await repository.setPassword({userId: user3._id, password});
      expect(passwordSet).toBeTruthy();

      const updatedPassword = await repository.getPasswordByUsername(user3.username);
      expect(updatedPassword.password).toEqual(password);
    });
  });

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

    it('registers a user with right data / service', async () => {});

    it('do not registers a user with wrong email / service', async () => {});

    it('searches for users / repo', async () => {});

    it('searches for a single user / repo', async () => {
      const {_id, username} = usersFixture[0];
      const user = await repository.search<{_id: ObjectId}>({username});

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

    it('modifies user data / repo', async () => {});

    it('follows a user / repo', async () => {});

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
});
