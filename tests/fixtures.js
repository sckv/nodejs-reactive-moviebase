const {ObjectId} = require('bson');

const UserIDS = {
  user0: new ObjectId('5cc85a65cbe99c36e2bec3fa'),
  user1: new ObjectId('5cc8587c2eceae102c1a8fdf'),
  user2: new ObjectId('5cc85971bf674494253f9a11'),
  user3: new ObjectId('5cc85a6a5e736fbf95f22149'),
  user4: new ObjectId('5cc85a6f235c8b03d50dd7d2'),
  user5: new ObjectId('5cc85a7379079fb9b6380554'),
  user6: new ObjectId('5cc85a77730f43c568092d29'),
  user7: new ObjectId('5cc85a7c99fa449e1bb581af'),
  user8: new ObjectId('5cc85a8068a68ce21bd67fde'),
  user9: new ObjectId('5cc85a831f3c1dc5802e8156'),
};

const MovieIDS = {
  movie0: new ObjectId('5cc85a88f21cf538e79b877b'),
  movie1: new ObjectId('5cc85a8d9b624789a0c9f5a8'),
  movie2: new ObjectId('5cc85a92e8d8de147d657cdc'),
  movie3: new ObjectId('5cc85a960bdd8bcdc13c1098'),
  movie4: new ObjectId('5cc85a9acd82de6067bf8ee5'),
  movie5: new ObjectId('5cc85a9f68fe8abf3707f2df'),
  movie6: new ObjectId('5cc85aa46e54f18d05510eae'),
  movie7: new ObjectId('5cc85aa86baa766f2fb48a2c'),
  movie8: new ObjectId('5cc85aac1751e1158feb0f1e'),
  movie9: new ObjectId('5cc85ab0e5ff5a9665c8fd7b'),
};

const ListIDS = {
  list0: new ObjectId('5cc85ab400a3d53ce644dfc5'),
  list1: new ObjectId('5cc85ab8e0bf18a4b2ec9852'),
  list2: new ObjectId('5cc85abc4eeaa8ba5a6f2826'),
  list3: new ObjectId('5cc85ac067cbdbfd08d9c2a7'),
  list4: new ObjectId('5cc85ac5e866f6172b51f283'),
  list5: new ObjectId('5cc85aca12e4c481c02b3c54'),
  list6: new ObjectId('5cc85acd290c6d7f4af78fe2'),
  list7: new ObjectId('5cc85ad2335e63b15ad06dae'),
  list8: new ObjectId('5cc85ad53667ef6e772d3f13'),
  list9: new ObjectId('5cc85adac38c0bdc7a3b449d'),
};

const moviesFixture = [
  {
    _id: MovieIDS.movie0,
    ttid: 'tt0',
    title: 'Movie 0 TEST',
    year: 1007,
    data: {
      en: {
        plot: 'Movie 0 EN PLOT',
        description: 'Movie 0 EN DESCRIPTION',
        poster: 'Movie 1 EN POSTER',
      },
      es: {
        plot: 'Movie 0 ESP PLOT',
        description: 'Movie 0 ESP DESCRIPCION',
        poster: 'Movie 0 ESP POSTER',
      },
    },

    ratedBy: [
      {
        userId: UserIDS.user0,
        comment: 'MOVIE 0 POR USER0',
        rate: 1,
      },
    ],
    hits: 0,
    createdAt: new Date(),
  },
  {
    _id: MovieIDS.movie1,
    ttid: 'tt1',
    title: 'Movie 1 TEST',
    year: 1007,
    data: {
      en: {
        plot: 'Movie 1 EN PLOT',
        description: 'Movie 1 EN DESCRIPTION',
        poster: 'Movie 1 EN POSTER',
      },
      es: {
        plot: 'Movie 1 ESP PLOT',
        description: 'Movie 1 ESP DESCRIPCION',
        poster: 'Movie 1 ESP POSTER',
      },
    },

    ratedBy: [
      {
        userId: UserIDS.user0,
        comment: 'MOVIE 1 POR USER 0',
        rate: 2,
      },
      {
        userId: UserIDS.user1,
        comment: 'MOVIE 1 POR USER 1',
        rate: 5,
      },
    ],
    hits: 0,
    createdAt: new Date(),
  },
  {
    _id: MovieIDS.movie2,
    ttid: 'tt2',
    title: 'Movie 2 TEST',
    year: 1007,
    data: {
      en: {
        plot: 'Movie 2 EN PLOT',
        description: 'Movie 2 EN DESCRIPTION',
        poster: 'Movie 2 EN POSTER',
      },
      es: {
        plot: 'Movie 2 ESP PLOT',
        description: 'Movie 2 ESP DESCRIPCION',
        poster: 'Movie 2 ESP POSTER',
      },
    },

    ratedBy: [
      {
        userId: UserIDS.user0,
        comment: 'MOVIE 2 POR USER0',
        rate: 4,
      },
    ],
    hits: 0,
    createdAt: new Date(),
  },
  {
    _id: MovieIDS.movie3,
    ttid: 'tt3',
    title: 'Movie 3 TEST',
    year: 1007,
    data: {
      en: {
        plot: 'Movie 3 EN PLOT',
        description: 'Movie 3 EN DESCRIPTION',
        poster: 'Movie 3 EN POSTER',
      },
      es: {
        plot: 'Movie 3 ESP PLOT',
        description: 'Movie 3 ESP DESCRIPCION',
        poster: 'Movie 3 ESP POSTER',
      },
    },

    ratedBy: [
      {
        userId: UserIDS.user1,
        comment: 'MOVIE 3 POR USER1',
        rate: 5,
      },
      {
        userId: UserIDS.user3,
        comment: 'MOVIE 3 POR USER3',
        rate: 5,
      },
    ],
    hits: 0,
    createdAt: new Date(),
  },
  {
    _id: MovieIDS.movie4,
    ttid: 'tt4',
    title: 'Movie 4 TEST',
    year: 1007,
    data: {
      en: {
        plot: 'Movie 4 EN PLOT',
        description: 'Movie 4 EN DESCRIPTION',
        poster: 'Movie 4 EN POSTER',
      },
      es: {
        plot: 'Movie 4 ESP PLOT',
        description: 'Movie 4 ESP DESCRIPCION',
        poster: 'Movie 4 ESP POSTER',
      },
    },

    ratedBy: [
      {
        userId: UserIDS.user1,
        comment: 'MOVIE 4 POR USER1',
        rate: 1,
      },
    ],
    hits: 0,
    createdAt: new Date(),
  },
  {
    _id: MovieIDS.movie5,
    ttid: 'tt5',
    title: 'Movie 5 TEST',
    year: 1007,
    data: {
      en: {
        plot: 'Movie 5 EN PLOT',
        description: 'Movie 5 EN DESCRIPTION',
        poster: 'Movie 5 EN POSTER',
      },
      es: {
        plot: 'Movie 5 ESP PLOT',
        description: 'Movie 5 ESP DESCRIPCION',
        poster: 'Movie 5 ESP POSTER',
      },
    },

    ratedBy: [
      {
        userId: UserIDS.user0,
        comment: 'MOVIE 5 POR USER0',
        rate: 3,
      },
      {
        userId: UserIDS.user3,
        comment: 'MOVIE 5 POR USER3',
        rate: 2,
      },
      {
        userId: UserIDS.user5,
        comment: 'MOVIE 5 POR USER5',
        rate: 2,
      },
    ],
    hits: 0,
    createdAt: new Date(),
  },
];

const usersFixture = [
  {
    _id: UserIDS.user0,
    username: 'testguy0',
    password: 'testpassword0',
    email: 'test0@email.com',
    language: 'en',
    active: true,
    follows: [UserIDS.user1, UserIDS.user2, UserIDS.user3],
    ratedMovies: [MovieIDS.movie0, MovieIDS.movie1, MovieIDS.movie2, MovieIDS.movie5],
    lists: [
      {
        _id: ListIDS.list0,
        title: 'Test List 0 of User0',
        description: 'Test List 0 of User0 description',
        private: false,
        movies: [MovieIDS.movie0, MovieIDS.movie1, MovieIDS.movie2, MovieIDS.movie5],
      },
      {
        _id: ListIDS.list1,
        title: 'Test List 1 of User0',
        description: 'Test List 1 of User0 description',
        private: false,
        movies: [MovieIDS.movie0],
      },
      {
        _id: ListIDS.list2,
        title: 'Test List 2 of User0',
        description: 'Test List 2 of User0 description',
        private: false,
        movies: [MovieIDS.movie0, MovieIDS.movie1, MovieIDS.movie2],
      },
    ],
    createdAt: new Date(),
    lastModified: new Date(),
  },
  {
    _id: UserIDS.user1,
    username: 'testguy1',
    password: 'testpassword1',
    email: 'test1@email.com',
    language: 'en',
    active: true,
    follows: [UserIDS.user3, UserIDS.user5],
    ratedMovies: [MovieIDS.movie1, MovieIDS.movie3, MovieIDS.movie4],
    lists: [
      {
        _id: ListIDS.list4,
        title: 'Test List 4 of User1',
        description: 'Test List 4 of User1 description',
        private: false,
        movies: [MovieIDS.movie3, MovieIDS.movie4],
      },
    ],
    createdAt: new Date(),
    lastModified: new Date(),
  },
  {
    _id: UserIDS.user2,
    username: 'testguy2',
    password: 'test password2',
    email: 'test2@email.com',
    language: 'en',
    active: false,
    follows: [],
    ratedMovies: [],
    lists: [],
    createdAt: new Date(),
    lastModified: new Date(),
  },
  {
    _id: UserIDS.user3,
    username: 'testguy3',
    password: 'testpassword3',
    email: 'test3@email.com',
    language: 'en',
    active: true,
    follows: [UserIDS.user2, UserIDS.user5],
    ratedMovies: [MovieIDS.movie3, MovieIDS.movie5],
    lists: [
      {
        _id: ListIDS.list5,
        title: 'Test List 5 of User3',
        description: 'Test List 5 of User3 description',
        private: false,
        movies: [MovieIDS.movie3, MovieIDS.movie5],
      },
    ],
    createdAt: new Date(),
    lastModified: new Date(),
  },
  {
    _id: UserIDS.user4,
    username: 'testguy4',
    password: 'testpassword4',
    email: 'test4@email.com',
    language: 'en',
    active: true,
    follows: [],
    ratedMovies: [],
    lists: [
      {
        _id: ListIDS.list6,
        title: 'Test List 6 of User4',
        description: 'Test List 6 of User4 description',
        private: false,
        movies: [],
      },
    ],
    createdAt: new Date(),
    lastModified: new Date(),
  },
  {
    _id: UserIDS.user5,
    username: 'testguy5',
    password: 'testpassword5',
    email: 'test5@email.com',
    language: 'es',
    active: true,
    follows: [],
    ratedMovies: [MovieIDS.movie5],
    lists: [],
    createdAt: new Date(),
    lastModified: new Date(),
  },
];

module.exports = {usersFixture, moviesFixture, UserIDS, ListIDS, MovieIDS};
