import {Injectable, NotAcceptableException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {RepositoryConstants} from '@ezyfs/common/enums/Repository-inventory.enum';
import {ArchiveJob, CryptographicJob} from '@ezyfs/repositories/entities';

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
