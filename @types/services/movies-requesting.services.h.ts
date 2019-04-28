declare module 'types/movies-requesting.services' {
  interface Movie {
    _id: string;
    ttid: string;
    title: string;
    year: number;
    data: {
      plot: string;
      description: string;
      poster: string;
    };
  }

  interface MovieThin {
    _id: string;
    ttid: string;
    title: string;
    year: number;
    data: {
      poster: string;
    };
  }

  interface MovieSlim {
    _id: string;
    ttid: string;
    title: string;
    data: {
      poster: string;
    };
  }
}
