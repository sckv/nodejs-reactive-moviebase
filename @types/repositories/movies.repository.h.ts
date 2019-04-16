declare module 'types/movies.repository' {
  import {LanguageType} from 'types/User.model';

  interface SearchMoviesObject {
    language: LanguageType;
    page?: number;
    pageSize?: number;
    title?: string;
    year?: string;
    sort?: string;
  }

  interface MovieCreateObject {
    ttid: string;
    title: string;
    year: number;
    data: {
      es: {
        plot: string;
        description: string;
        poster: string;
      };
      en: {
        plot: string;
        description: string;
        poster: string;
      };
    };
  }
}
