import {EmailQueue} from '@src/services/email/queue';
import {sendMail} from '@src/services/email/sender';
import {Job} from 'bull';
import {EmailSendData} from 'types/utils';
import {logger} from '@src/utils/logger';

EmailQueue.process(function(job: Job<EmailSendData>) {
  return sendMail(job.data).then(([res]) => logger.info('Email sent to: ' + job.data.to, 'Service response: ', res));
});
