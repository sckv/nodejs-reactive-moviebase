import rq from 'request-promise-native';
import {OMDBMovieResponse} from 'types/external-movies';
const OMDB_URL = `http://www.omdbapi.com/?apikey=${process.env.OMBD_API_KEY}&i=`;

export const plotMovie = async (ttId: string): Promise<OMDBMovieResponse | null> => {
  const response = (await rq({
    url: OMDB_URL + ttId,
    method: 'GET',
    json: true,
  })) as OMDBMovieResponse;

  return response.Response ? response : null;
};
