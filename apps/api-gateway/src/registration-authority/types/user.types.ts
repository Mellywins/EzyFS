import {User} from '@ezyfs/repositories';
import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class FindAllUsersResponse {
  @Field((_) => [User])
  users: User[];
}
