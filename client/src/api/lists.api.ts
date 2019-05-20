import { SecureFetcher } from '@src/utils/secure-fetcher';
import { fetcher } from '@src/utils/fetcher';
import { ListEntry } from 'types/listing.services';

const host = process.env.WEB_HOSTNAME || 'localhost';

const listsApiUrl = `https://${host}/api/lists/`;

export const ListsApi = {
  getUserLists: (userId: string) => SecureFetcher(fetcher.get<ListEntry[]>({ url: listsApiUrl + userId + '/get' })),

  getList: (listId: string) => SecureFetcher(fetcher.get<ListEntry>({ url: listsApiUrl + listId })),

  create: (body: { title: string; description: string; isPrivate: boolean }) =>
    SecureFetcher(fetcher.post({ url: listsApiUrl, body })),

  patchList: (listId: string, body: { title: string; description: string; isPrivate: boolean }) =>
    SecureFetcher(fetcher.patch({ url: listsApiUrl + listId, body })),

  addToList: (listId: string, body: { movieId: string; commentary: string; rate: number }) =>
    SecureFetcher(fetcher.patch({ url: listsApiUrl + listId + 'add-to', body })),

  removeFromList: (listId: string, movieId: string) =>
    SecureFetcher(fetcher.patch({ url: listsApiUrl + listId, body: { movieId } })),

  deleteList: (listId: string) => SecureFetcher(fetcher.delete({ url: listsApiUrl + listId })),
};
