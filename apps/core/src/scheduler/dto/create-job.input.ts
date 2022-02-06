import {InputType, Int, Field} from '@nestjs/graphql';
import {isNotEmpty, IsNotEmpty, IsOptional} from 'class-validator';
import {CompDecompType} from '@ezyfs/common/enums/comp-decomp-type.enum';
import {EncDecType} from '@ezyfs/common/enums/enc-dec-type.enum';
import {ProcessorType} from '@ezyfs/common/enums/Processor-types.enum';
import {SourceTypeEnum} from '@ezyfs/common/enums/Source-Type.enum';
import {GenericJobTypeSpec} from '@ezyfs/common/enums/generic-jobtype-spec.type';
@InputType()
export class CreateJobInput {
  @Field(() => ProcessorType)
  @IsNotEmpty()
  jobType: ProcessorType;

  @Field(() => GenericJobTypeSpec, {nullable: true, defaultValue: null})
  @IsOptional()
  jobTypeSpec: GenericJobTypeSpec;

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
  @Field({nullable: true})
  @IsOptional()
  privateKey?: string;

  @Field({nullable: true})
  @IsOptional()
  signWithEncryption: boolean;

  @Field({nullable: true})
  @IsOptional()
  passphrase?: string;

  @Field({nullable: true})
  @IsOptional()
  ancestorJobId: string;
}
