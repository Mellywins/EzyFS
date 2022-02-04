import {Field, InputType} from '@nestjs/graphql';
import {IsNotEmpty} from 'class-validator';

@InputType()
export class CredentialsInput {
  @Field()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsNotEmpty()
  password: string;
}
