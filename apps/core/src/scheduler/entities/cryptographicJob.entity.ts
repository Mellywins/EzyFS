import {Field, HideField, ObjectType} from '@nestjs/graphql';
import {Column, Entity, ManyToOne, OneToMany} from 'typeorm';
import {EncDecType} from '@ezyfs/common/enums/enc-dec-type.enum';
import {QueuedJob} from './Job.entity';

@ObjectType()
@Entity()
export class CryptographicJob extends QueuedJob {
  @ManyToOne((type) => CryptographicJob, (job) => job.childJobs)
  @Field((type) => CryptographicJob, {nullable: true})
  ancestorJob: CryptographicJob;

  @OneToMany((type) => CryptographicJob, (job) => job.ancestorJob)
  @Field((type) => [CryptographicJob], {nullable: true})
  childJobs: CryptographicJob[];

  @HideField()
  @Column({nullable: true})
  iv?: string;

  @HideField()
  @Column({nullable: true})
  secret?: string;

  @Field((type) => EncDecType)
  @Column({nullable: false})
  jobTypeSpec: EncDecType;
}
