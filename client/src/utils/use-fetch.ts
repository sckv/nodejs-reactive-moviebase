import * as React from 'react';
import { FetcherResponse } from '@src/utils/fetcher';

export const useFetch = <T>(fetchInstance: () => FetcherResponse<T | null>, startItem: any = null) => {
  const [data, setData] = React.useState<T | null>(startItem);
  React.useEffect(() => {
    const makeFetch = async () => {
      const response = await fetchInstance();
      if (response !== null && response.ok) {
        setData(response.data);
      }
    };
    makeFetch();
  }, []);

  return { data, promise: new Promise(res => res()) };
};
