import {readFileSync} from 'fs';
import {createHash} from 'crypto';
export const hashTools = {
  hashFile: (filePath: string): string =>
    createHash('sha256').update(readFileSync(filePath)).digest('hex'),
  hashString: (ch: string): string =>
    createHash('sha256').update(ch).digest('hex'),
};
