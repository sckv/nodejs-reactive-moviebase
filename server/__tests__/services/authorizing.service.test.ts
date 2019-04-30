import {Db, MongoClient} from 'mongodb';

import {connectToDatabase} from '../../src/database';
import {usersFixture} from '../fixtures/users.fixture';
import {moviesFixture} from '../fixtures/movies.fixture';

// Service & Repo
import {AuthServices} from '../../src/pkg/authorizing/authorizing.services';
import {AuthRepository} from '../../src/pkg/storage/mongo/auth.repository';
import {UserIDS} from '../fixtures/IDs';

type ThenArg<T> = T extends Promise<infer U> ? U : T;

jest.setTimeout(25000);

const SESSION_TEST_TOKEN = 'TESTSESSIONTOKEN-X';
const ACTIVATION_TEST_TOKEN = 'TESTACTIVATIONTOKEN-X';
const RECOVERY_TEST_TOKEN = 'TESTRECOVERYTOKEN-X';
const RESET_TEST_TOKEN = 'TESTRESETTOKEN-X';

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
    await database.collection('movies').insertMany(moviesFixture);
    repository = AuthRepository(database);
    services = await AuthServices(database);
  }, 5000);
  afterAll(async () => {
    await database.dropCollection('users');
    await database.dropCollection('movies');
    await database.dropCollection('sessions');

    await connection.close();
  }, 1000);

  it('gets password by username / repo', async () => {
    const user0 = usersFixture[0];
    const {password} = await repository.getPasswordByUsername(user0.username);
    expect(password).toEqual(user0.password);
  });

  it('sets session / repo', async () => {
    const user1 = usersFixture[1];
    const user = await repository.setSession({username: user1.username, sessionToken: SESSION_TEST_TOKEN});
    expect('' + user.userId).toEqual('' + user1._id.toHexString());
  });

  it('gets session / repo', async () => {
    const user1 = usersFixture[1];
    const session = await repository.getSession(SESSION_TEST_TOKEN);
    expect('' + session.userId).toEqual('' + user1._id.toHexString());
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
