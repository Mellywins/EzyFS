export interface DecryptionJobPayload {
  sourcePath: string;
  outputPath: string;
  ownerId: number;
  publicKey?: string;
  privateKey: string;
  passphrase?: string;
  cipherKey?: Buffer | string;
}
