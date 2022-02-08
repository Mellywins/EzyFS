/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {Field, HideField, ObjectType} from '@nestjs/graphql';
import {Column, Entity, ManyToOne, OneToMany} from 'typeorm';
import {EncDecType} from '@ezyfs/common/enums/enc-dec-type.enum';
import {QueuedJob} from './base/job.entity';

@ObjectType()
@Entity()
export class CryptographicJob extends QueuedJob {
  @ManyToOne((_type) => CryptographicJob, (job) => job.childJobs)
  @Field((_type) => CryptographicJob, {nullable: true})
  ancestorJob: CryptographicJob;

  @OneToMany((_type) => CryptographicJob, (job) => job.ancestorJob)
  @Field((_type) => [CryptographicJob], {nullable: true})
  childJobs: CryptographicJob[];

  @HideField()
  @Column({nullable: true})
  iv?: string;

  @HideField()
  @Column({nullable: true})
  secret?: string;

  @Field((_type) => EncDecType)
  @Column({nullable: false})
  jobTypeSpec: EncDecType;
}
