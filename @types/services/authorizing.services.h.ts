declare module 'types/authorizing.services' {
  interface LoginObject {
    username: string;
    password: string;
  }

  interface LoginResponseObject {
    userId: string;
    token: string;
  }
}
