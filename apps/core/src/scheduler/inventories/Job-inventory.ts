import {InjectQueue} from '@nestjs/bull';
import {Injectable, NotAcceptableException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Queue} from 'bull';
import {get} from 'http';
import {Repository} from 'typeorm';
import {ProcessorType} from '@ezyfs/common/enums/Processor-types.enum';
import {QueueType} from '@ezyfs/common/enums/Queue.enum';
import {RepositoryConstants} from '@ezyfs/common/enums/Repository-inventory.enum';
import {
  ArchiveJob,
  CryptographicJob,
  QueuedJob,
} from '@ezyfs/repositories/entities';

@Injectable()
export class JobInventory {
  constructor(
    @InjectRepository(CryptographicJob)
    private readonly cryptographicJobRepository: Repository<CryptographicJob>,
    @InjectRepository(ArchiveJob)
    private readonly archiveJobRepository: Repository<ArchiveJob>,
  ) {}

  get(
    repositoryType: RepositoryConstants,
  ): Repository<ArchiveJob | CryptographicJob> {
    switch (repositoryType) {
      case RepositoryConstants.ARCHIVE:
        return this.archiveJobRepository;
      case RepositoryConstants.CRYPTO:
        return this.cryptographicJobRepository;
      default:
        throw new NotAcceptableException(
          'Must provide correct Repository type',
        );
    }
  }
}
