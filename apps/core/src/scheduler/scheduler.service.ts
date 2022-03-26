import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {CreateJobInput} from './dto/create-job.input';
// import {UpdateSchedulerInput} from './dto/update-scheduler.input';
import {QueuedJob} from '@ezyfs/repositories/entities';
import jobCreatorFactory from './factories/abstract/job-factory';
import {QueueInventory} from './inventories/Queue-inventory';
import {CryptoService} from '../crypto/crypto.service';
import {JobInventory} from './inventories/Job-inventory';
import {RegistrationAuthorityInternalServiceRPC} from '@ezyfs/common/types/rpc/registration-authority/internal-service.rpc.interface';
import {ClientGrpc} from '@nestjs/microservices';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private registrationAuthorityRPC: RegistrationAuthorityInternalServiceRPC;
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly jobInventory: JobInventory,
    private readonly QI: QueueInventory,
    @Inject('RA') private RA_Client: ClientGrpc,
  ) {}
  onModuleInit() {
    this.registrationAuthorityRPC =
      this.RA_Client.getService<RegistrationAuthorityInternalServiceRPC>(
        'RegistrationAuthorityInternalService',
      );
    console.log(this.registrationAuthorityRPC);
  }
  async create(createJobInput: CreateJobInput): Promise<QueuedJob> {
    return jobCreatorFactory(
      createJobInput.jobType,
      createJobInput.jobTypeSpec,
    )(
      createJobInput,
      this.registrationAuthorityRPC,
      this.jobInventory,
      this.QI,
      this.cryptoService,
    );
  }
}
