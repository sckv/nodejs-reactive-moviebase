import {promisify} from 'util';
import crypto from 'crypto';

export const generateToken = async (length: number = 76) => {
  const randomBuffer = await promisify(crypto.randomBytes)(length);
  return randomBuffer.toString('hex');
};
