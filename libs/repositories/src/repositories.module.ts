import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ArchiveJob, AsymKey, CryptographicJob, Email, User} from '.';
import {RepositoriesService} from './repositories.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      CryptographicJob,
      ArchiveJob,
      Email,
      AsymKey,
    ]),
  ],
  providers: [RepositoriesService],
  exports: [RepositoriesService],
})
export class RepositoriesModule {}
