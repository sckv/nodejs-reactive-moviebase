declare module 'types/cache' {
  interface CacheDigestableMessage<T = {[k: string]: any}> {
    data: T;
    url?: string;
  }
}
