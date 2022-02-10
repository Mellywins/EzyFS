import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ArchiveJob, AsymKey, CryptographicJob, Email, User} from '.';
import {RepositoriesService} from './repositories.service';

@Module({
  imports: [],
  providers: [RepositoriesService],
  exports: [],
})
export class RepositoriesModule {}
