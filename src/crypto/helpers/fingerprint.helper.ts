import {createHash} from 'crypto';
export const fingerprint = async (publicKey: string) =>
  createHash('sha512').update(publicKey).digest('hex');
