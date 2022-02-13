/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {UserRoleEnum, CurrentUser, TokenModel} from '@ezyfs/common';
import {Auth} from '@ezyfs/common/decorators/auth.decorator';
import {
  FirstStageUserInput,
  SecondStageDTOInput,
  UpdateUserInput,
  ResetPasswordInput,
  CredentialsInput,
} from '@ezyfs/common/dtos';
import {User} from '@ezyfs/repositories/entities';
import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
// import {EmailVerificationInput} from 'apps/core/src/email/dto/email-verification.input';
// import {ResetPasswordEmailInput} from 'apps/core/src/email/dto/reset-password-email.input';
import {BoolValue} from '@ezyfs/proto-schema/google/protobuf/wrappers.type';
import {RegistrationAuthorityService} from './registration-authority.service';

@Resolver()
export class RegistrationAuthorityResolver {
  constructor(
    private readonly registrationAuthorityService: RegistrationAuthorityService,
  ) {}
  // @Mutation((returns) => User)
  // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return this.userService.create(createUserInput);
  // }

  @Mutation((returns) => User)
  firstStageSignUp(
    @Args('firstStageUserInput') firstStageUserInput: FirstStageUserInput,
  ) {}

  @Mutation((returns) => User)
  secondStageSignUp(
    @Args('secondStageDTOInput') secondStageDTOInput: SecondStageDTOInput,
  ) {}

  @Query((returns) => [User], {name: 'users'})
  @Auth(UserRoleEnum.ADMIN)
  findAll() {}

  @Query((returns) => User, {name: 'user'})
  @Auth(UserRoleEnum.USER)
  findOne(@CurrentUser() user: User, @Args('id') id: number) {}

  @Mutation((returns) => User)
  @Auth(UserRoleEnum.USER)
  update(
    @CurrentUser() user: User,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    // return this.userService.update(user, updateUserInput.id, updateUserInput);
  }

  @Mutation((returns) => User)
  @Auth(UserRoleEnum.USER)
  remove(@CurrentUser() user: User, @Args('id') id: number) {
    // return this.userService.remove(user, id);
  }

  // @Mutation((returns) => TokenModel)
  // confirmEmail(
  //   @Args('emailVerificationInput')
  //   emailVerificationInput: EmailVerificationInput,
  // ) {
  //   // return this.userService.validUserConfirmation(emailVerificationInput);
  // }

  // @Mutation((returns) => Boolean)
  // sendResetPasswordEmail(
  //   @Args('ResetPasswordEmailInput')
  //   resetPasswordEmailInput: ResetPasswordEmailInput,
  // ) {
  //   // return this.userService.sendResetPasswordEmail(resetPasswordEmailInput);
  // }

  @Mutation((returns) => Boolean)
  resetPassword(
    @Args('ResetPasswordInput')
    resetPasswordInput: ResetPasswordInput,
  ) {
    // return this.userService.resetPassword(resetPasswordInput);
  }

  @Query((returns) => BoolValue)
  async userExistByEmail(@Args('email') email: string) {
    return this.registrationAuthorityService.userExistByEmail(email);
  }

  @Query((returns) => BoolValue)
  userExistByUsername(@Args('username') username: string) {
    return this.registrationAuthorityService.userExistByUsername(username);
  }

  @Mutation((returns) => TokenModel)
  login(@Args('credentialsInput') credentialsInput: CredentialsInput) {
    // return this.authService.login(credentialsInput);
  }

  @Query((returns) => TokenModel)
  refreshToken(@Args('refreshToken') refreshToken: string) {
    // return this.authService.refreshToken(refreshToken);
  }
}
