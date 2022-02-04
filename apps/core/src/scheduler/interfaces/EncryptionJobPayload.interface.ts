export interface EncryptionJobPayload {
  sourcePath: string;
  outputPath: string;
  ownerId: number;
  publicKey: string;
  privateKey: string;
  signWithEncryption?: boolean;
  passphrase?: string;
  cipherKey?: Buffer | string;
  cipherIV?: Buffer | string;
}
