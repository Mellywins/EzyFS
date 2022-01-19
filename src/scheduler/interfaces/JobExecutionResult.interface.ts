import {ExecutionStatusEnum} from '../../shared/enums/Execution-status.enum';

export interface JobExecutionResult {
  processedOn: Date | string;
  failedReason: number | null;
  executionStatus: ExecutionStatusEnum;
  attemptsMade: number;
  delay: number;
}
