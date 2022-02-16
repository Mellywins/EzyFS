/* eslint-disable camelcase */
import {Field, ObjectType} from '@nestjs/graphql';
import {User} from '@ezyfs/repositories/entities';

@ObjectType()
export class TokenModel {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => User)
  user: User;
}
