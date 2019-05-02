import {Db, MongoClient, ObjectId} from 'mongodb';

import {connectToDatabase} from '../../src/database';
import {usersFixture} from '../fixtures/users.fixture';
import {moviesFixture} from '../fixtures/movies.fixture';

jest.setTimeout(25000);

describe('Testing services...', () => {
  require('./authorizing.tests');
  require('./user-controling.tests');
  require('./cache.tests');
});
