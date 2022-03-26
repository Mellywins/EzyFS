import {Queue} from 'bull';
import {CreateJobInput} from '../../../scheduler/dto/create-job.input';
import failedJobExecutor from '../../../scheduler/helpers/failed-job-executor';
import successfulJobExecutor from '../../../scheduler/helpers/successful-job-executor';
import {DecompressionJobPayload} from './../../../scheduler/interfaces/DecomperssionJobPayload.interface';
import {QueueInventory} from '../../../scheduler/inventories/Queue-inventory';
import {Repository} from 'typeorm';
import {v4 as uuidv4} from 'uuid';
import {CryptoService} from '../../../crypto/crypto.service';
import {ArchiveJob} from '@ezyfs/repositories/entities';
import {CompDecompType} from '@ezyfs/common/enums/comp-decomp-type.enum';
import {JobInventory} from '../../inventories/Job-inventory';
import {RepositoryConstants} from '@ezyfs/common/enums/Repository-inventory.enum';
import {RegistrationAuthorityInternalServiceRPC} from '@ezyfs/common/types/rpc/registration-authority/internal-service.rpc.interface';
export const createDecompressionJob = async (
  createJobInput: CreateJobInput,
  userService: RegistrationAuthorityInternalServiceRPC,
  JI: JobInventory,
  QI: QueueInventory,
  cryptoService: CryptoService,
) => {
  const user = await userService
    .internalFindOne(createJobInput.userId)
    .toPromise();
  const Q: Queue<any> = QI.get(createJobInput.jobType);
  const payload: DecompressionJobPayload = {
    sourcePath: createJobInput.sourcePath,
    outputPath: createJobInput.outputPath,
    ownerId: createJobInput.userId,
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
    startDate: startTimestamp,
    owner: user,
    jobTypeSpec: jobTypeSpec as unknown as CompDecompType,
  });
  await jobRepo.save(createdJob);
  successfulJobExecutor(Q, jobRepo);
  failedJobExecutor(Q, jobRepo);
  return createdJob;
};
