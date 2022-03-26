import {CreateJobInput} from '../../../scheduler/dto/create-job.input';
import failedJobExecutor from '../../../scheduler/helpers/failed-job-executor';
import successfulJobExecutor from '../../../scheduler/helpers/successful-job-executor';
import {CompressionJobPayload} from '../../../scheduler/interfaces/CompressionJobPayload.interface';
import {QueueInventory} from '../../../scheduler/inventories/Queue-inventory';
import {ExecutionStatusEnum} from '@ezyfs/common/enums/Execution-status.enum';
import {Repository} from 'typeorm';
import {v4 as uuidv4} from 'uuid';
import {CryptoService} from '../../../crypto/crypto.service';
import {ProcessorType} from '@ezyfs/common/enums/Processor-types.enum';
import {ArchiveJob} from '@ezyfs/repositories/entities';
import {CompDecompType} from '@ezyfs/common/enums/comp-decomp-type.enum';
import {JobInventory} from '../../inventories/Job-inventory';
import {RepositoryConstants} from '@ezyfs/common/enums/Repository-inventory.enum';
import {RegistrationAuthorityInternalServiceRPC} from '@ezyfs/common/types/rpc/registration-authority/internal-service.rpc.interface';

export const createCompressionJob = async (
  createJobInput: CreateJobInput,
  userService: RegistrationAuthorityInternalServiceRPC,
  JI: JobInventory,
  QI: QueueInventory,
  cryptoService: CryptoService,
) => {
  const user = await userService
    .internalFindOne(createJobInput.userId)
    .toPromise();
  console.log(user);
  const Q = QI.get(createJobInput.jobType);
  const payload: CompressionJobPayload = {
    sourcePath: createJobInput.sourcePath,
    outputPath: createJobInput.outputPath,
    ownerId: user.id,
    sourceType: createJobInput.sourceType,
  };
  const jId = uuidv4();
  await Q.add(
    {...payload},
    {
      jobId: jId,
    },
  );
  const jobRepo = JI.get(RepositoryConstants.ARCHIVE) as Repository<ArchiveJob>;
  const startTimestamp: Date = new Date();
  const {userId, jobTypeSpec, ...jobInfo} = createJobInput;
  const createdJob: ArchiveJob = jobRepo.create({
    JobId: jId,
    ...jobInfo,
    lastExecutionStatus: ExecutionStatusEnum.WAITING,
    startDate: startTimestamp,
    owner: user,
    jobType: ProcessorType.COMPRESSION,
  });

  // const processedJob: Job<any> = await this.compressionQueue.getJob(jId);
  await jobRepo.save(createdJob);
  successfulJobExecutor(Q, jobRepo);
  failedJobExecutor(Q, jobRepo);
  return createdJob;
};
