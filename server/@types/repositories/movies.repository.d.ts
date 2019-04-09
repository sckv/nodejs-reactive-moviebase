declare module 'types/movies.repository' {
  type SearchMoviesObject = {
    page?: number;
    pageSize?: number;
    title?: string;
    year?: string;
    sort?: string;
  };
}
