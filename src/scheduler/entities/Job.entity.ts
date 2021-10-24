/* eslint-disable @typescript-eslint/no-unused-vars */
import {ObjectType, Field, Int} from '@nestjs/graphql';
import {Column, Entity, ManyToOne, PrimaryColumn} from 'typeorm';
import {User} from '../../user/entities/user.entity';
import {TimestampEntites} from '../../generics/timestamp.entity';
import {ProcessorType} from '../../shared/enums/Processor-types.enum';
import {SourceTypeEnum} from '../../shared/enums/Source-Type.enum';
import {ExecutionStatusEnum} from '../../shared/enums/Execution-status.enum';

@ObjectType()
@Entity()
export class QueuedJob extends TimestampEntites {
  @Field(() => Int, {nullable: false})
  @PrimaryColumn()
  id: number;

  @Field((type) => ProcessorType)
  @Column({
    type: 'enum',
    enum: ProcessorType,
    default: null,
    array: false,
    nullable: true,
  })
  jobType: ProcessorType;

  @Field({nullable: true})
  @Column({nullable: true})
  sourcePath: string;

  @Field({nullable: true})
  @Column({nullable: true})
  outputPath: string;

  @Field((type) => SourceTypeEnum, {nullable: true})
  @Column({
    type: 'enum',
    enum: SourceTypeEnum,
    default: null,
    array: false,
    nullable: true,
  })
  sourceType: SourceTypeEnum;

  @ManyToOne(() => User, (user) => user.Jobs)
  @Field((type) => User)
  owner: User;

  @Field({nullable: true})
  @Column({nullable: true})
  cronString?: string;

  @Field({nullable: true})
  @Column({nullable: true})
  lastExecutionDate: Date;

  @Field((type) => ExecutionStatusEnum, {nullable: true})
  @Column({
    type: 'enum',
    enum: ExecutionStatusEnum,
    default: null,
    array: false,
    nullable: true,
  })
  lastExecutionStatus: ExecutionStatusEnum;
}
