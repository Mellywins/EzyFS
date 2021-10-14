/* eslint-disable camelcase */
import {Field, ObjectType} from '@nestjs/graphql';
import {User} from '../../user/entities/user.entity';

@ObjectType()
export class TokenModel {
  @Field()
  access_token: string;

  @Field()
  refresh_token: string;

  @Field(() => User)
  user: User;
}
