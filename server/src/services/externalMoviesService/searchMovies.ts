import rq from 'request-promise-native';
import qs from 'qs';
import {MovieSearchResult, IMDBMoviesResponse} from '@src/services/externalMoviesService/externalMovies';
import {jsonSafeParse} from '@src/utils';
const IMDB_URL_PREFIX = 'https://v2.sg.media-imdb.com/suggests/';

export const searchMovies = async (criteria: string): Promise<MovieSearchResult[]> => {
  const searchUrl = IMDB_URL_PREFIX + createEncodedCriteria(criteria);
  const result = await rq({
    uri: searchUrl,
    transform(body: string) {
      const startIndex = body.indexOf('(');
      const endIndex = body.indexOf(')');
      const extracted = body.substring(startIndex + 1, endIndex);
      return jsonSafeParse<any>(extracted).d;
    },
  });
  return transformToSearchResult(result);
};

export const createEncodedCriteria = (searchString: string) => {
  let result = '';
  if (!searchString.length) return result;
  result += searchString.substr(1, 1);
  result += '/';
  result += qs.parse(searchString);
  result += '.json';
  return result;
};

const transformToSearchResult = (data: IMDBMoviesResponse[]): MovieSearchResult[] => {
  return data.map(({id, l, i, y}) => ({
    title: l,
    ttid: id,
    year: y,
    image: {
      url: i[0],
      height: i[1],
      width: i[2],
    },
  }));
};
