import {ObjectType} from '@nestjs/graphql';
import {Column, Entity} from 'typeorm';
import {CompDecompType} from '@ezyfs/common/enums/comp-decomp-type.enum';
import {QueuedJob} from './Job.entity';

@ObjectType()
@Entity()
export class ArchiveJob extends QueuedJob {
  @Column({nullable: false})
  jobTypeSpec: CompDecompType;
}
