import {InputType, Int, Field} from '@nestjs/graphql';
import {isNotEmpty, IsNotEmpty, IsOptional} from 'class-validator';
import {ProcessorType} from '../../shared/enums/Processor-types.enum';
import {SourceTypeEnum} from '../../shared/enums/Source-Type.enum';

@InputType()
export class CreateJobInput {
  @Field(() => ProcessorType)
  @IsNotEmpty()
  jobType: ProcessorType;

  @Field()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsNotEmpty()
  sourcePath: string;

  @Field()
  @IsNotEmpty()
  outputPath: string;

  @Field(() => SourceTypeEnum, {defaultValue: SourceTypeEnum.FILE})
  @IsNotEmpty()
  sourceType: SourceTypeEnum;

  @Field({nullable: true})
  cronString?: string;

  @Field({nullable: false})
  userId: number;

  @Field({nullable: false})
  startDate: Date;

  @Field({nullable: true})
  @IsOptional()
  endDate?: Date;
}
