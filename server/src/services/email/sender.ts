import mailer from '@sendgrid/mail';
import { EmailSendData } from 'types/utils';

mailer.setApiKey(process.env.SENDGRID_API_KEY);

const EMAIL_FROM_ADDRESS = process.env.EMAIL_FROM_ADDRESS;

export const sendMail = (data: EmailSendData) => {
  console.log('sending email with this data>>', data);
  console.log('sending from>>>', EMAIL_FROM_ADDRESS);
  return mailer.send({ ...data, from: EMAIL_FROM_ADDRESS });
};
