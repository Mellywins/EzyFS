import {Field, InputType} from '@nestjs/graphql';
import {IsEmail, IsNotEmpty, MinLength} from 'class-validator';

@InputType()
export class FirstStageUserInput {
  @Field()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
