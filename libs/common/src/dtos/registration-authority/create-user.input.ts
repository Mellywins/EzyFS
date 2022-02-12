/* eslint-disable @typescript-eslint/no-unused-vars */
import {Field, InputType, Int} from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import {Gender} from '@ezyfs/common/enums/gender.enum';
// import {FirstStageUserInput} from './first-stage-user.input';
// import {SecondStageDTOInput} from './second-stage-user.input';

// type a = firstStageUserInput | SecondStageDTOInput;
@InputType()
export class CreateUserInput {
  @Field((type) => Int, {nullable: true})
  id: number;

  @Field()
  @IsNotEmpty()
  username: string;

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
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsNotEmpty()
  localization: string;

  @Field()
  @IsPhoneNumber()
  @IsNotEmpty()
  telNumber: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @Field(() => [String], {nullable: true})
  roles?: string[];

  @Field((type) => Gender)
  gender: Gender;
}
