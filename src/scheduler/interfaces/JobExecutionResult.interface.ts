import {ExecutionStatusEnum} from '../../shared/enums/Execution-status.enum';

export interface JobExecutionResult {
  processedOn:Date;
  failedReason: string | null;
  executionStatus: ExecutionStatusEnum;
  attemptsMade: number;
  delay: number;
}
