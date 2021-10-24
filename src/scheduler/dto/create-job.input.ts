import {InputType, Int, Field} from '@nestjs/graphql';
import {isNotEmpty, IsNotEmpty} from 'class-validator';
import {ProcessorType} from '../../shared/enums/Processor-types.enum';
import {SourceTypeEnum} from '../../shared/enums/Source-Type.enum';

@InputType()
export class CreateJobInput {
  @Field()
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

  @Field()
  @IsNotEmpty()
  sourceType: SourceTypeEnum;

  @Field()
  cronString?: string;

  @Field({nullable: false})
  userId: number;
}
