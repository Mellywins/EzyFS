import { SourceTypeEnum } from "src/shared/enums/Source-Type.enum";

export interface EncryptionJobPayload {
  sourcePath: string;
  outputPath: string;
  ownerId: number;
  encryptionAlgo?: string;
  sourceType: SourceTypeEnum;
}
