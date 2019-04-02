export interface MovieSearchResult {
  ttid: string;
  title: string;
  year: number;
  image: {
    url: string;
    height: number;
    width: number;
  };
}

export interface TranslatedText {
  data: {
    translations: [
      {
        translatedText: string;
        model: 'nmt';
      }
    ];
  };
}

export interface IMDBMoviesResponse {
  l: string;
  id: string;
  y: number;
  i: [string, number, number];
}

export interface OMDBMovieResponse {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Rating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export interface Rating {
  Source: string;
  Value: string;
}
