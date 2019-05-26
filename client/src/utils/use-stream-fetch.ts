import * as React from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { FetcherResponse } from '@src/utils/fetcher';
import { MoviesSelector } from '@src/store/reducers/movies.reducer';
import { MoviesActions } from '@src/store/actions/movies.actions';

export const useStreamFetch = (
  fetchInstance: () => FetcherResponse<ReadableStreamDefaultReader<Uint8Array> | null>,
) => {
  let timer: any;
  let response: any;

  const movies = useSelector(MoviesSelector, shallowEqual);
  const dispatch = useDispatch();
  
  React.useEffect(() => {
    const readStream = async () => {
      response = await fetchInstance();
      if (response && response.ok && response.data) {
        const abort = () => {
          clearInterval(timer);
          response.data!.cancel();
          response.ok && response.abortCall();
        };
        timer = setInterval(async () => {
          try {
            const { done, value } = await response.data!.read();
            if (done) {
              return abort();
            }
            if (value) {
              const decoded = JSON.parse(new TextDecoder('utf-8').decode(value));
              if (decoded.length) return movies.concat(decoded);

              if (!movies.find((d: any) => decoded._id === d.id)) return [decoded].concat(movies);

              dispatch(
                MoviesActions.addMoviesData(
                  movies.map((dt: any) => {
                    if (dt._id === decoded._id) return decoded;
                    else return dt;
                  }),
                ),
              );
            }
          } catch (error) {
            console.log('error reading stream>>', error);
          }
        }, 500);
      }
    };

    readStream();

    return () => {
      clearInterval(timer);
      if (response && response.data) {
        response.data.cancel();
        response.ok && response.abortCall();
      }
    };
  }, [movies]);

};
