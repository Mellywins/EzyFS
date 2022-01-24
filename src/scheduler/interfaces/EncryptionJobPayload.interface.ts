export interface EncryptionJobPayload {
  sourcePath: string;
  outputPath: string;
  ownerId: number;
  publicKey: string;
}
