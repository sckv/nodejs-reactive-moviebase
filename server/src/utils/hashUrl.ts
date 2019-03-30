import crypto from 'crypto';

export const hashUrl = async (url: string) => {
  return crypto
    .createHash('SHA256')
    .update(url)
    .digest('hex');
};
