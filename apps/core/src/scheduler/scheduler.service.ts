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
import {GrpcGenericClientService} from '@ezyfs/internal/grpc-clients/grpc-generic-client.service';
import {GrpcToken} from '@ezyfs/internal/grpc-clients/types';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private registrationAuthorityRPC: RegistrationAuthorityInternalServiceRPC;
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly jobInventory: JobInventory,
    private readonly QI: QueueInventory,
    private readonly grpcGenericService: GrpcGenericClientService,
  ) {}
  onModuleInit() {
    const client = this.grpcGenericService.getService(
      GrpcToken.REGISTRATION_AUTHORITY,
    );
    this.registrationAuthorityRPC =
      client.getService<RegistrationAuthorityInternalServiceRPC>(
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
