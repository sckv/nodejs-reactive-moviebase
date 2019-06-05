import { SecureFetcher } from '@src/utils/secure-fetcher';
import { fetcher } from '@src/utils/fetcher';
import { LoginResponseObject } from 'types/authorizing.services';

const host = process.env.WEB_HOSTNAME || 'localhost';

const authApiUrl = `https://${host}/api/auth/`;

export const AuthApi = {
  login: (body: { username: string; password: string }) =>
    SecureFetcher(fetcher.post<LoginResponseObject>({ url: authApiUrl + 'login', body })),

  logout: () => SecureFetcher(fetcher.post({ url: authApiUrl + 'logout' })),

  forgot: (email: string) => SecureFetcher(fetcher.post({ url: authApiUrl + 'forgot', body: { email } })),

  checkRecoveryToken: (token: string) =>
    SecureFetcher(fetcher.post<{ resetToken: string }>({ url: authApiUrl + 'check-recovery/' + token })),

  setNewPassword: (token: string, password: string) =>
    SecureFetcher(fetcher.post({ url: authApiUrl + 'reset-password/' + token, body: { password } })),
};
