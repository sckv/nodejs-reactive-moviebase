import { Db, MongoClient, ObjectId } from 'mongodb';

import { connectToDatabase } from '../../src/database';
import { usersFixture } from '../fixtures/users.fixture';
import { moviesFixture } from '../fixtures/movies.fixture';
import { MovieInsertError } from '../../src/errors/domain-errors/movie-insert';
// Service & Repo
import { MoviesRequestingServices } from '../../src/pkg/movies-requesting/movies-requesting.services';
import { MoviesRepository } from '../../src/pkg/storage/mongo/movies.repository';
import { UserIDS } from '../fixtures/IDs';

type ThenArg<T> = T extends Promise<infer U> ? U : T;

jest.setTimeout(25000);

export default describe('<-- Movies control service / repository -->', () => {
  let database: Db;
  let connection: MongoClient;
  let repository: ReturnType<typeof MoviesRepository>;
  let services: ThenArg<ReturnType<typeof MoviesRequestingServices>>;

  beforeAll(async () => {
    const connect = await connectToDatabase();
    database = connect.connection.db('movies-test');
    connection = connect.connection;

    await database.collection('users').insertMany(usersFixture);
    await database.collection('users').createIndex({ email: 1 }, { unique: true });
    await database.collection('users').createIndex({ username: 1 }, { unique: true });

    await database.collection('movies').insertMany(moviesFixture);
    await database.collection('movies').createIndex({ ttid: 1 });
    await database.collection('movies').createIndex({ year: 'text', title: 'text', data: 'text' }, {
      weights: {
        title: 10,
        data: 5,
      },
      name: 'TextIndex',
      default_language: 'english',
    } as any);

    repository = MoviesRepository(database);
    services = await MoviesRequestingServices(database);
  }, 5000);
  afterAll(async () => {
    await database.dropCollection('users');
    await database.dropCollection('movies');

    await connection.close();
  }, 2500);

  it('gets a movieById', async () => {
    const movieExample = moviesFixture[0];
    const movie = await repository.get({ movieId: movieExample._id });

    expect(movie._id).toEqual(movieExample._id);
    expect(movie.ttid).toBe(movieExample.ttid);
  });

  it('gets a movieByTtid', async () => {
    const movieExample = moviesFixture[0];
    const movie = await repository.getByTtid({ ttid: movieExample.ttid });

    expect(movie.movieId).toEqual(movieExample._id);
  });

  it('adds a movie to the database', async () => {
    const added = await repository.add(additionalMovies[0]);
    const movieByTtid = await repository.getByTtid({ ttid: additionalMovies[0].ttid, fullMovie: true });

    expect(added).toBeTruthy();
    expect(movieByTtid.title).toBe(additionalMovies[0].title);
    expect(movieByTtid.ttid).toBe(additionalMovies[0].ttid);
  });

  it('adds array of movies to the database', async () => {
    const added = await repository.add([additionalMovies[1], additionalMovies[2]]);
    const movie1ByTtid = await repository.getByTtid({ ttid: additionalMovies[1].ttid, fullMovie: true });
    const movie2ByTtid = await repository.getByTtid({ ttid: additionalMovies[2].ttid, fullMovie: true });

    expect(added).toBeTruthy();
    expect(movie1ByTtid.title).toBe(additionalMovies[1].title);
    expect(movie1ByTtid.ttid).toBe(additionalMovies[1].ttid);
    expect(movie2ByTtid.title).toBe(additionalMovies[2].title);
    expect(movie2ByTtid.ttid).toBe(additionalMovies[2].ttid);
  });

  it('fails if same movie', async () => {
    try {
      await repository.add(additionalMovies[2]);
    } catch (error) {
      expect(error).toBeInstanceOf(MovieInsertError);
    }
  });

  it('fails if same movie in array', async () => {
    try {
      await repository.add([additionalMovies[3], additionalMovies[2]]);
    } catch (error) {
      // TODO: find how to debug better errors
      expect(error.data.error.result.result.nInserted).toBe(1);
      expect(error).toBeInstanceOf(MovieInsertError);
    }
  });

  it('search for a movie', async () => {
    const movie = additionalMovies[1];
    const searchResult = await repository.search({ criteria: movie.title });
    expect(searchResult[0].ttid).toBe(movie.ttid);
  });
});

export const additionalMovies = [
  {
    ttid: 'tt0TEST',
    title: 'ADDITIONAL MOVIE FOR TESTING No 0',
    year: 2019,
    poster: 'ADDITIONAL MOVIE FOR TESTING No 0 POSTER',
    data: {
      es: {
        plot: 'ADDITIONAL MOVIE FOR TESTING No 0 PLOT',
        description: 'ADDITIONAL MOVIE FOR TESTING No 0 DESCRIPTION',
      },
      en: {
        plot: 'ADDITIONAL MOVIE FOR TESTING No 0 PLOT ENG',
        description: 'ADDITIONAL MOVIE FOR TESTING No 0 DESCRIPTION ENG',
      },
    },
  },
  {
    ttid: 'tt1TEST',
    title: 'ADDITIONAL MOVIE FOR TESTING No 1',
    year: 2019,
    poster: 'ADDITIONAL MOVIE FOR TESTING No 1 POSTER',
    data: {
      es: {
        plot: 'ADDITIONAL MOVIE FOR TESTING No 1 PLOT',
        description: 'ADDITIONAL MOVIE FOR TESTING No 1 DESCRIPTION',
      },
      en: {
        plot: 'ADDITIONAL MOVIE FOR TESTING No 1 PLOT ENG',
        description: 'ADDITIONAL MOVIE FOR TESTING No 1 DESCRIPTION ENG',
      },
    },
  },
  {
    ttid: 'tt2TEST',
    title: 'ADDITIONAL MOVIE FOR TESTING No 2',
    year: 2029,
    poster: 'ADDITIONAL MOVIE FOR TESTING No 2 POSTER',
    data: {
      es: {
        plot: 'ADDITIONAL MOVIE FOR TESTING No 2 PLOT',
        description: 'ADDITIONAL MOVIE FOR TESTING No 2 DESCRIPTION',
      },
      en: {
        plot: 'ADDITIONAL MOVIE FOR TESTING No 2 PLOT ENG',
        description: 'ADDITIONAL MOVIE FOR TESTING No 2 DESCRIPTION ENG',
      },
    },
  },
  {
    ttid: 'tt3TEST',
    title: 'ADDITIONAL MOVIE FOR TESTING No 3',
    year: 2039,
    poster: 'ADDITIONAL MOVIE FOR TESTING No 3 POSTER',
    data: {
      es: {
        plot: 'ADDITIONAL MOVIE FOR TESTING No 3 PLOT',
        description: 'ADDITIONAL MOVIE FOR TESTING No 3 DESCRIPTION',
      },
      en: {
        plot: 'ADDITIONAL MOVIE FOR TESTING No 3 PLOT ENG',
        description: 'ADDITIONAL MOVIE FOR TESTING No 3 DESCRIPTION ENG',
      },
    },
  },
  {
    ttid: 'tt4TEST',
    title: 'ADDITIONAL MOVIE FOR TESTING No 4',
    year: 2049,
    poster: 'ADDITIONAL MOVIE FOR TESTING No 4 POSTER',
    data: {
      es: {
        plot: 'ADDITIONAL MOVIE FOR TESTING No 4 PLOT',
        description: 'ADDITIONAL MOVIE FOR TESTING No 4 DESCRIPTION',
      },
      en: {
        plot: 'ADDITIONAL MOVIE FOR TESTING No 4 PLOT ENG',
        description: 'ADDITIONAL MOVIE FOR TESTING No 4 DESCRIPTION ENG',
      },
    },
  },
];
