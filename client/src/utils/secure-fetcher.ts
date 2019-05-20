import { FetcherResponse } from '@src/utils/fetcher';

export const SecureFetcher = async <T>(fetcherInstance: FetcherResponse<T>) => {
  try {
    const response = await fetcherInstance;
    return response;
  } catch (error) {
    console.log('error', error);
    return null;
  }
};
