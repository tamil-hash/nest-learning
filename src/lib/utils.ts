import * as crypto from 'crypto';

export function generateRandomId(stringLength: number): string {
  return `blt${crypto.randomBytes(stringLength).toString('hex')}`;
}
