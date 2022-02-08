/* eslint-disable camelcase */
import {Field, ObjectType} from '@nestjs/graphql';
import {User} from '@ezyfs/repositories/entities';

@ObjectType()
export class TokenModel {
  @Field()
  access_token: string;

  @Field()
  refresh_token: string;

  @Field(() => User)
  user: User;
}
