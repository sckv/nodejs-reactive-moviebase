import {MovieIDS, UserIDS} from './IDs';

export const moviesFixture = [
  {
    _id: MovieIDS.movie0,
    ttid: 'tt0',
    title: 'Movie 0 TEST',
    year: 1007,
    poster: 'Movie 0 EN POSTER',
    data: {
      en: {
        plot: 'Movie 0 EN PLOT',
        description: 'Movie 0 EN DESCRIPTION',
      },
      es: {
        plot: 'Movie 0 ESP PLOT',
        description: 'Movie 0 ESP DESCRIPCION',
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
    poster: 'Movie 1 POSTER',
    data: {
      en: {
        plot: 'Movie 1 EN PLOT',
        description: 'Movie 1 EN DESCRIPTION',
      },
      es: {
        plot: 'Movie 1 ESP PLOT',
        description: 'Movie 1 ESP DESCRIPCION',
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
    poster: 'Movie 2 POSTER',
    data: {
      en: {
        plot: 'Movie 2 EN PLOT',
        description: 'Movie 2 EN DESCRIPTION',
      },
      es: {
        plot: 'Movie 2 ESP PLOT',
        description: 'Movie 2 ESP DESCRIPCION',
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
    poster: 'Movie 3 POSTER',
    data: {
      en: {
        plot: 'Movie 3 EN PLOT',
        description: 'Movie 3 EN DESCRIPTION',
      },
      es: {
        plot: 'Movie 3 ESP PLOT',
        description: 'Movie 3 ESP DESCRIPCION',
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
    poster: 'Movie 4 POSTER',
    data: {
      en: {
        plot: 'Movie 4 EN PLOT',
        description: 'Movie 4 EN DESCRIPTION',
      },
      es: {
        plot: 'Movie 4 ESP PLOT',
        description: 'Movie 4 ESP DESCRIPCION',
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
    poster: 'Movie 5 ESP POSTER',
    data: {
      en: {
        plot: 'Movie 5 EN PLOT',
        description: 'Movie 5 EN DESCRIPTION',
      },
      es: {
        plot: 'Movie 5 ESP PLOT',
        description: 'Movie 5 ESP DESCRIPCION',
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
