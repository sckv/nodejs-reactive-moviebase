import {EmailQueue} from '@src/services/email/queue';
import {EmailSendData} from 'types/utils';

export const enqueueEmail = (data: EmailSendData) => EmailQueue.add(data);
