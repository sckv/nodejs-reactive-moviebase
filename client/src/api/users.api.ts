import { SecureFetcher } from '@src/utils/secure-fetcher';
import { fetcher } from '@src/utils/fetcher';
import { UserThin, UserFull } from 'types/user-controlling.services';

const host = process.env.WEB_HOSTNAME || 'localhost';

const usersApiUrl = `https://${host}/api/users/`;

export const UsersApi = {
  activate: (token: string) => SecureFetcher(fetcher.post({ url: usersApiUrl + 'activate/' + token })),

  register: (body: { username: string; email: string; password: string }) =>
    SecureFetcher(fetcher.post({ url: usersApiUrl + 'register', body })),

  getUserData: (params: {
    username: string;
    pd: boolean;
    ld: boolean;
    md: boolean;
    page?: number;
    followers: boolean;
    follows: boolean;
  }) => SecureFetcher(fetcher.get<Partial<UserFull>>({ url: usersApiUrl + 'user', params })),

  modify: (userId: string, body: { password?: string; language?: string }) =>
    SecureFetcher(fetcher.patch({ url: usersApiUrl + userId, body })),

  follow: (userId: string) => SecureFetcher(fetcher.post({ url: usersApiUrl + 'follow', body: { userId } })),
  unfollow: (userId: string) => SecureFetcher(fetcher.post({ url: usersApiUrl + 'unfollow', body: { userId } })),

  search: (username: string, page?: number) =>
    SecureFetcher(fetcher.get<UserThin[]>({ url: usersApiUrl, params: { un: username, page } })),
};
