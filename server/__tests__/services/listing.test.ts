import {Db, MongoClient, ObjectId} from 'mongodb';

import {connectToDatabase} from '../../src/database';
import {usersFixture} from '../fixtures/users.fixture';
import {moviesFixture} from '../fixtures/movies.fixture';
import {UserNotFoundError} from '../../src/errors/domain-errors/user-not-found';
import {InvalidEmailError} from '../../src/errors/application-errors/invalid-email';
import {UserRegisterError} from '../../src/errors/domain-errors/user-register';
// Service & Repo
import {ListingServices} from '../../src/pkg/listing/listing.services';
import {ListsRepository} from '../../src/pkg/storage/mongo/lists.repository';
import {UserIDS, ListIDS, MovieIDS} from '../fixtures/IDs';

type ThenArg<T> = T extends Promise<infer U> ? U : T;

jest.setTimeout(25000);

export default describe('<-- Listing control service / repository -->', () => {
  let database: Db;
  let connection: MongoClient;
  let repository: ReturnType<typeof ListsRepository>;
  let services: ThenArg<ReturnType<typeof ListingServices>>;

  beforeAll(async () => {
    const connect = await connectToDatabase();
    database = connect.connection.db('listing-test');
    connection = connect.connection;

    await database.collection('users').insertMany(usersFixture);
    await database.collection('users').createIndex({email: 1}, {unique: true});
    await database.collection('users').createIndex({username: 1}, {unique: true});

    await database.collection('movies').insertMany(moviesFixture);

    repository = ListsRepository(database);
    services = await ListingServices(database);
  }, 5000);
  afterAll(async () => {
    await database.dropCollection('users');
    await database.dropCollection('movies');

    await connection.close();
  }, 2500);

  it('searches lists by userId, omits private when not authorized', async () => {
    const lists = await repository.getByUser(usersFixture[0]._id);

    expect(lists).toEqual(expect.arrayContaining([user0UnwindedLists[0], user0UnwindedLists[2]]));
  });

  it('searches lists by userId, omits private when another user', async () => {
    const lists = await repository.getByUser(usersFixture[0]._id, usersFixture[1]._id);

    expect(lists).toEqual(expect.arrayContaining([user0UnwindedLists[0], user0UnwindedLists[2]]));
  });

  it('searches lists by userId, returns private when hes list', async () => {
    const lists = await repository.getByUser(usersFixture[0]._id, usersFixture[0]._id);

    expect(lists).toEqual(expect.arrayContaining(user0UnwindedLists));
  });

  it('gets a list by id if not private', async () => {
    const list = usersFixture[0].lists[0];
    const listById = await services.get({listId: list._id});

    expect(listById.title).toBe(list.title);
    expect(listById.description).toBe(list.description);
    expect(listById.movies).toEqual(expect.arrayContaining(user0UnwindedLists[0].movies));
  });

  it('do not gets a list by id if it is private', async () => {
    const list = usersFixture[0].lists[1];
    const listById = await services.get({listId: list._id});

    expect(listById).toBeNull();
  });

  it('do not gets a list by id if it is private and requested by other user', async () => {
    const list = usersFixture[0].lists[1];
    const listById = await services.get({listId: list._id, selfId: usersFixture[1]._id});

    expect(listById).toBeNull();
  });

  it('gets a list by id if it is private and requested by owner', async () => {
    const list = usersFixture[0].lists[1];
    const user = usersFixture[0];
    const listById = await services.get({listId: list._id, selfId: user._id});

    expect(listById).not.toBeNull();
    expect(listById.title).toBe(list.title);
    expect(listById.description).toBe(list.description);
    expect(listById.movies).toEqual(expect.arrayContaining(user0UnwindedLists[1].movies));
  });

  it('creates list', async () => {
    const newListObject = {
      title: 'NEW LIST FOR TESTING',
      description: 'NEW LSIT DESCRIPTION FOR TESTING',
      isPrivate: false,
    };
    const user = usersFixture[0];
    const listsOld = await repository.getByUser(user._id);
    const newList = await services.create({selfId: user._id, ...newListObject});
    const listsNew = await repository.getByUser(user._id);

    const listEntry = listsNew.find(
      (l: any) => l.title === newListObject.title && l.description === newListObject.description,
    );

    expect(newList).toBeTruthy();
    expect(listsOld.length).toBeLessThan(listsNew.length);
    expect(listEntry).toBeDefined();
  });

  it('modify a list', async () => {
    const newListObject = {
      title: 'NEW LIST FOR TESTING MOD',
      description: 'NEW LSIT DESCRIPTION FOR TESTING MOD',
      isPrivate: true,
    };
    const user = usersFixture[0];
    const listsOld = await repository.getByUser(user._id, user._id);
    const updatedList = await services.modify({selfId: user._id, listId: user.lists[0]._id, ...newListObject});
    const listsNew = await repository.getByUser(user._id, user._id);

    const listEntry = listsNew.find(
      (l: any) => l.title === newListObject.title && l.description === newListObject.description,
    );

    expect(updatedList).toBeTruthy();
    expect(listsOld.length).toBe(listsNew.length);
    expect(listEntry).toBeDefined();
  });
});

const user0UnwindedLists = [
  {
    _id: new ObjectId('5cc85ab400a3d53ce644dfc5'),
    title: 'Test List 0 of User0',
    description: 'Test List 0 of User0 description',
    private: false,
    movies: [
      {
        _id: new ObjectId('5cc85a88f21cf538e79b877b'),
        title: 'Movie 0 TEST',
        poster: 'Movie 0 EN POSTER',
        rate: 1,
      },
      {
        _id: new ObjectId('5cc85a8d9b624789a0c9f5a8'),
        title: 'Movie 1 TEST',
        poster: 'Movie 1 POSTER',
        rate: 2,
      },
      {
        _id: new ObjectId('5cc85a92e8d8de147d657cdc'),
        title: 'Movie 2 TEST',
        poster: 'Movie 2 POSTER',
        rate: 4,
      },
      {
        _id: new ObjectId('5cc85a9f68fe8abf3707f2df'),
        title: 'Movie 5 TEST',
        poster: 'Movie 5 ESP POSTER',
        rate: 3,
      },
    ],
  },
  {
    _id: new ObjectId('5cc85ab8e0bf18a4b2ec9852'),
    title: 'Test List 1 of User0',
    description: 'Test List 1 of User0 description',
    private: true,
    movies: [
      {_id: new ObjectId('5cc85a88f21cf538e79b877b'), poster: 'Movie 0 EN POSTER', rate: 1, title: 'Movie 0 TEST'},
    ],
  },
  {
    _id: new ObjectId('5cc85abc4eeaa8ba5a6f2826'),
    title: 'Test List 2 of User0',
    description: 'Test List 2 of User0 description',
    private: false,
    movies: [
      {
        _id: new ObjectId('5cc85a88f21cf538e79b877b'),
        poster: 'Movie 0 EN POSTER',
        rate: 1,
        title: 'Movie 0 TEST',
      },
      {
        _id: new ObjectId('5cc85a8d9b624789a0c9f5a8'),
        poster: 'Movie 1 POSTER',
        rate: 2,
        title: 'Movie 1 TEST',
      },
      {
        _id: new ObjectId('5cc85a92e8d8de147d657cdc'),
        poster: 'Movie 2 POSTER',
        rate: 4,
        title: 'Movie 2 TEST',
      },
    ],
  },
];

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
