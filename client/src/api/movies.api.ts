import { SecureFetcher } from '@src/utils/secure-fetcher';
import { fetcher } from '@src/utils/fetcher';
import { SearchMoviesObject } from 'types/movies.repository';
import { LanguageType } from 'types/User.model';

import { MovieRequest } from 'types/movies-requesting.services';

const host = process.env.WEB_HOSTNAME || 'localhost';

const moviesApiUrl = `https://${host}/api/movies/`;

export const MoviesApi = {
  searchCriteria: (criteria: string) =>
    SecureFetcher(fetcher.get<MovieRequest[]>({ url: moviesApiUrl, params: { c: criteria } })),

  searchStream: ({
    criteria,
    language,
    page,
    pageSize,
    sort,
  }: {
    sort: SearchMoviesObject['sort'];
    criteria?: string;
    page?: number;
    pageSize?: number;
    language?: LanguageType;
  }) =>
    SecureFetcher(
      fetcher.getStream({
        url: moviesApiUrl,
        params: { s: sort, c: criteria, l: language, ps: pageSize, p: page },
      }),
    ),
  getByTtid: (ttid: string) => SecureFetcher(fetcher.get<MovieRequest>({ url: `${moviesApiUrl}${ttid}/by-ttid` })),

  getById: (_id: string) => SecureFetcher(fetcher.get<MovieRequest>({ url: `${moviesApiUrl}${_id}` })),
};
