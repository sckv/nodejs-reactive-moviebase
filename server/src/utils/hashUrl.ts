import crypto from 'crypto';

export const hashUrl = (url: string) => {
  return crypto
    .createHash('SHA256')
    .update(url)
    .digest('hex');
};
