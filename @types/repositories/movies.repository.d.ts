declare module 'types/movies.repository' {
  type SearchMoviesObject = {
    language: LanguageType;
    page?: number;
    pageSize?: number;
    title?: string;
    year?: string;
    sort?: string;
  };

  type LanguageType = 'es' | 'en';
}
