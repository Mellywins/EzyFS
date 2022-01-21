import {readFileSync} from 'fs';
import {createHash} from 'crypto';
export const hash = (filePath: string): string =>
  createHash('sha256').update(readFileSync(filePath)).digest('hex');
