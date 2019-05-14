import * as React from 'react';
import { FetcherResponse } from '@src/utils/fetcher';

export const useStreamFetch = (
  fetchInstance: () => FetcherResponse<ReadableStreamDefaultReader<Uint8Array> | null>,
  setData: React.Dispatch<React.SetStateAction<any>>,
) => {
  let timer: any;
  let response: any;

  React.useEffect(() => {
    const readStream = async () => {
      response = await fetchInstance();
      if (response && response.ok && response.data) {
        const abort = () => {
          response.data!.cancel();
          response.abortCall && response.abortCall();
          clearInterval(timer);
        };
        timer = setInterval(async () => {
          try {
            const { done, value } = await response.data!.read();
            if (done) {
              return abort();
            }
            if (value) {
              const decoded = JSON.parse(new TextDecoder('utf-8').decode(value));
              setData((data: any) => (decoded.length ? data.concat(decoded) : [decoded].concat(data)));
            }
          } catch (error) {
            console.log('error reading stream>>', error);
            // return abort();
          }
        }, 500);
      }
    };

    readStream();

    return () => {
      clearInterval(timer);
      if (response && response.data) {
        response.data.cancel();
        response.abortCall();
      }
    };
  }, []);
};
