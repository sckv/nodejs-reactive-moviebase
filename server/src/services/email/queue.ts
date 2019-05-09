import Queue from 'bull';
import {EmailSendData} from 'types/utils';

const redisAddress = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

export const EmailQueue = new Queue<EmailSendData>('emailer', redisAddress);
