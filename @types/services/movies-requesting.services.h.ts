declare module 'types/movies-requesting.services' {
  interface MovieRequest {
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

  interface MovieRequestThin {
    _id: string;
    ttid: string;
    title: string;
    year: number;
    data: {
      poster: string;
    };
  }

  interface MovieRequestSlim {
    _id: string;
    ttid: string;
    title: string;
    data: {
      poster: string;
    };
  }
}
