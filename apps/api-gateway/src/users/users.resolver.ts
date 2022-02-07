/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {Resolver, Query, Mutation, Args} from '@nestjs/graphql';
import {CurrentUser} from '@ezyfs/common/decorators/current-user.decorator';
import {UserRoleEnum} from '@ezyfs/common/enums/user-role.enum';
import {Auth} from '@ezyfs/common/decorators/auth.decorator';
import {TokenModel} from 'apps/core/src/auth/dto/token.model';
import {EmailVerificationInput} from 'apps/core/src/email/dto/email-verification.input';
import {ResetPasswordEmailInput} from 'apps/core/src/email/dto/reset-password-email.input';
import {FirstStageUserInput} from 'apps/core/src/user/dto/first-stage-user.input';
import {ResetPasswordInput} from 'apps/core/src/user/dto/reset-password.input';
import {SecondStageDTOInput} from 'apps/core/src/user/dto/second-stage-user.input';
import {UpdateUserInput} from 'apps/core/src/user/dto/update-user.input';
import {UserService} from 'apps/core/src/user/user.service';
import {User} from 'apps/core/src/user/entities/user.entity';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly userService: UserService) {}

  // @Mutation((returns) => User)
  // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return this.userService.create(createUserInput);
  // }

  @Mutation((returns) => User)
  firstStageSignUp(
    @Args('firstStageUserInput') firstStageUserInput: FirstStageUserInput,
  ) {
    return this.userService.firstStageSignUp(firstStageUserInput);
  }

  @Mutation((returns) => User)
  secondStageSignUp(
    @Args('secondStageDTOInput') secondStageDTOInput: SecondStageDTOInput,
  ) {
    return this.userService.secondStageSignUp(secondStageDTOInput);
  }

  @Query((returns) => [User], {name: 'users'})
  @Auth(UserRoleEnum.ADMIN)
  findAll() {
    return this.userService.findAll();
  }

  @Query((returns) => User, {name: 'user'})
  @Auth(UserRoleEnum.USER)
  findOne(@CurrentUser() user: User, @Args('id') id: number) {
    return this.userService.findOne(user, id);
  }

  @Mutation((returns) => User)
  @Auth(UserRoleEnum.USER)
  update(
    @CurrentUser() user: User,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return this.userService.update(user, updateUserInput.id, updateUserInput);
  }

  @Mutation((returns) => User)
  @Auth(UserRoleEnum.USER)
  remove(@CurrentUser() user: User, @Args('id') id: number) {
    return this.userService.remove(user, id);
  }

  @Mutation((returns) => TokenModel)
  confirmEmail(
    @Args('emailVerificationInput')
    emailVerificationInput: EmailVerificationInput,
  ) {
    return this.userService.validUserConfirmation(emailVerificationInput);
  }

  @Mutation((returns) => Boolean)
  sendResetPasswordEmail(
    @Args('ResetPasswordEmailInput')
    resetPasswordEmailInput: ResetPasswordEmailInput,
  ) {
    return this.userService.sendResetPasswordEmail(resetPasswordEmailInput);
  }

  @Mutation((returns) => Boolean)
  resetPassword(
    @Args('ResetPasswordInput')
    resetPasswordInput: ResetPasswordInput,
  ) {
    return this.userService.resetPassword(resetPasswordInput);
  }

  @Query((returns) => Boolean)
  existByEmail(@Args('email') email: string) {
    return this.userService.userExistByEmail(email);
  }

  @Query((returns) => Boolean)
  existByUsername(@Args('username') username: string) {
    return this.userService.userExistByUsernam(username);
  }
}
