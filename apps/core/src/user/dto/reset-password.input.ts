import {Field, InputType} from '@nestjs/graphql';
import {MinLength} from 'class-validator';
import {TokensInterface} from '../../shared/types/tokens.interface';

@InputType()
export class ResetPasswordInput extends TokensInterface {
  @Field()
  email: string;

  @MinLength(6)
  @Field()
  password: string;
}
