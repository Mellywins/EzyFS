import { SourceTypeEnum } from "src/shared/enums/Source-Type.enum";

export interface CompressionJobPayload {
  sourcePath: string;
  outputPath: string;
  ownerId: number;
  encryptionAlgo?: string;
  sourceType: SourceTypeEnum;
}
