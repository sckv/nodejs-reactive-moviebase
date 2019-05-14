import { FetcherResponse } from '@src/utils/fetcher';

export const SecureFetcher = async <T = any>(fetcherInstance: FetcherResponse<T>) => {
  try {
    const response = await fetcherInstance;
    return response;
  } catch (error) {
    console.log('error', error);
    return null;
  }
};
