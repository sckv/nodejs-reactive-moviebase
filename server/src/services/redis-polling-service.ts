import IOredis, {Redis} from 'ioredis';
import EventEmitter from 'events';
import {jsonSafeParse} from '@src/utils';

const {REDIS_PORT, REDIS_HOST, REDIS_DB} = process.env;

const RedisPoller = new IOredis({
  port: +REDIS_PORT || 6379,
  host: REDIS_HOST || 'localhost',
  db: +REDIS_DB || 0,
});

export const REDIS_CACHE_KEY_PREFIX = 'cache:';

class RedisServiceClass {
  private static _instance: RedisServiceClass;
  private emitter: EventEmitter = new EventEmitter();
  private subscriptionsList: string[] = [];
  private rPoller: Redis;
  private rListener: Redis;

  constructor() {
    this.rPoller = RedisPoller;
    this.eventsHandler();
  }

  private eventsHandler() {
    this.rPoller.subscribe('__keyevent@0__:hset');
    this.rPoller.on('message', (_, key) => {
      if (this.subscriptionsList.includes(key)) {
        this.pushToListeners(key);
      }
    });
  }

  private async pushToListeners(key: string) {
    const rawData = await this.rListener.get(key);
    const data = jsonSafeParse(rawData);

    if (this.emitter.listeners(key).length) {
      this.emitter.emit(key, data);
    }
  }

  public subscribeTo(hash: string) {
    const prefixed = REDIS_CACHE_KEY_PREFIX + hash;
    if (!this.subscriptionsList.includes(prefixed)) {
      this.subscriptionsList.push(prefixed);
    }

    return {
      consume: this.emitter.on,
      force: () => this.pushToListeners(hash),
    };
  }

  public unsubscribeFrom(hash: string, listener: (...args: any[]) => void) {
    const indexOfHash = this.subscriptionsList.indexOf(hash);
    if (indexOfHash > -1) {
      this.subscriptionsList.splice(indexOfHash, 1);
      this.emitter.removeListener(hash, listener);
      return true;
    }
    return false;
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }
}

export const RedisStreamingService = RedisServiceClass.Instance as RedisService;

export interface RedisService {
  subscribeTo(
    hash: string,
  ): {
    consume(event: string | symbol, listener: (...args: any[]) => void): void;
    force(): Promise<void>;
  };
  unsubscribeFrom(hash: string, listener: (...args: any[]) => void): boolean;
}
