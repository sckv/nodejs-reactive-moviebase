declare module 'types/movies.repository' {
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

  type LanguageType = 'es' | 'en';
}
