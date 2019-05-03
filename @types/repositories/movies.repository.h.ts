declare module 'types/movies.repository' {
  import {LanguageType} from 'types/User.model';

  interface SearchMoviesObject {
    language: LanguageType;
    page?: number;
    pageSize?: number;
    criteria?: string;
    sort?: 'hitsAsc' | 'hitsDesc' | 'latest' | 'oldest' | 'topRated' | 'worstRated';
  }

  interface MovieCreateObject {
    ttid: string;
    title: string;
    year: number;
    poster: string;
    data: {
      es: {
        plot: string;
        description: string;
      };
      en: {
        plot: string;
        description: string;
        poster: string;
      };
    };
  }
}
