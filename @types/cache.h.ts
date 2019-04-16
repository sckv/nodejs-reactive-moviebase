declare module 'types/cache' {
  interface CacheDigestableMessage {
    data: {[k: string]: any};
    url: string;
  }
}
