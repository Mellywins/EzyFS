import {ObjectType, Field, Int} from '@nestjs/graphql';
import {User} from 'src/user/entities/user.entity';
import {Column, Entity, PrimaryColumn} from 'typeorm';
import {TimestampEntites} from '../../generics/timestamp.entity';
import {ProcessorType} from '../../shared/enums/Processor-types.enum';
import {SourceTypeEnum} from '../../shared/enums/Source-Type.enum';

@ObjectType()
@Entity()
export class QueuedJob extends TimestampEntites {
  @Field(() => Int, {nullable: false})
  @PrimaryColumn()
  id: number;

  @Field((type) => [ProcessorType])
  @Column({
    type: 'enum',
    enum: ProcessorType,
    default: null,
    array: false,
    nullable: true,
  })
  jobType: ProcessorType;

  @Field()
  @Column()
  sourcePath: string;

  @Field()
  @Column()
  outputPath: string;

  @Field()
  @Column()
  sourceType: SourceTypeEnum;

  @Field()
  @Column()
  owner: User;

  @Field()
  @Column()
  cronString: string;
}
