import {Field, InputType} from '@nestjs/graphql';
import {IsNotEmpty, IsPhoneNumber, Max, Min} from 'class-validator';
import {Gender} from '@ezyfs/common/enums/gender.enum';

@InputType()
export class SecondStageDTOInput {
  @Field()
  @IsNotEmpty()
  id: number;

  @Field()
  @IsNotEmpty()
  localization: string;

  @Field()
  @IsPhoneNumber()
  @IsNotEmpty()
  telNumber: string;

  @Field()
  @IsNotEmpty()
  firstname: string;

  @Field()
  @IsNotEmpty()
  lastname: string;

  @Field()
  @Min(5)
  @Max(100)
  @IsNotEmpty()
  age: number;

  @Field()
  gender: Gender;
}
