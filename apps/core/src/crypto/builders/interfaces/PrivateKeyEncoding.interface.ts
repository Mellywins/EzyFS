export interface PrivateKeyEncoding {
  type: 'pkcs1' | 'pkcs8';
  format?: string;
  passphrase: string;
}
