import { FetcherResponse } from '@src/utils/fetcher';
import { dispatcher } from '@src/store/create-store';
import { NotifyActions } from '@src/store/actions/notification.actions';

export const SecureFetcher = async <T>(fetcherInstance: FetcherResponse<T>) => {
  try {
    const response = await fetcherInstance;
    if (response.status > 310)
      dispatcher(
        NotifyActions.error(
          response.data && (response.data as any).message ? (response.data as any).message : 'Error en el fetching',
        ),
      );

    return response;
  } catch (error) {
    console.log('error', error);
    return null;
  }
};
