import * as React from 'react';
import { useDispatch } from 'react-redux';
import { FetcherResponse } from '@src/utils/fetcher';
import { MoviesActions } from '@src/store/actions/movies.actions';
// import isEqual from 'react-fast-compare';

export const useStreamFetch = (
  fetchInstance: () => FetcherResponse<ReadableStreamDefaultReader<Uint8Array> | null>,
) => {
  let timer: any;
  let response: any;

  const dispatch = useDispatch();

  React.useEffect(() => {
    let movies: any = [];
    const readStream = async () => {
      response = await fetchInstance();
      if (response && response.ok && response.data) {
        const abort = () => {
          clearInterval(timer);
          response.data!.cancel();
        };
        timer = setInterval(async () => {
          try {
            const { done, value } = await response.data!.read();
            if (done) {
              return abort();
            }
            if (value) {
              const decoded = JSON.parse(new TextDecoder('utf-8').decode(value));
              if (decoded.length) movies = [...movies].concat(decoded);

              if (!decoded.length && !movies.find((d: any) => decoded._id === d.id)) movies = [decoded].concat(movies);

              if (decoded)
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
        // response.ok && response.abortCall();
      }
    };
  }, []);
};
