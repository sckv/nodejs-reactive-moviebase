import * as React from 'react';
import { FetcherResponse } from '@src/utils/fetcher';

export const useFetch = <T = any>(fetchInstance: FetcherResponse<T>, startItem: any = null) => {
  const [data, setData] = React.useState<T>(startItem);
  React.useEffect(() => {
    const makeFetch = async () => {
      const response = await fetchInstance;
      if (response && response.ok) {
        setData(response.data);
      }
    };
    makeFetch();
  }, []);

  return data;
};
