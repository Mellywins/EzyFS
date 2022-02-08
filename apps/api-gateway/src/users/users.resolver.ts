/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {Resolver, Query, Mutation, Args} from '@nestjs/graphql';
import {CurrentUser} from '@ezyfs/common/decorators/current-user.decorator';
import {UserRoleEnum} from '@ezyfs/common/enums/user-role.enum';
import {Auth} from '@ezyfs/common/decorators/auth.decorator';
import {TokenModel} from 'apps/core/src/auth/dto/token.model';
import {FirstStageUserInput} from 'apps/core/src/user/dto/first-stage-user.input';

import {User} from '@ezyfs/repositories/entities';

@Resolver((of) => User)
export class UsersResolver {
  // @Mutation((returns) => User)
  // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return this.userService.create(createUserInput);
  // }

  @Query((returns) => User)
  firstStageSignUp(
    @Args('firstStageUserInput') firstStageUserInput: FirstStageUserInput,
  ) {}
}
