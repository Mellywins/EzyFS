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
  ResetPasswordEmailInput,
  EmailVerificationInput,
} from '@ezyfs/common/dtos';
import {User} from '@ezyfs/repositories/entities';
import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
// import {EmailVerificationInput} from 'apps/core/src/email/dto/email-verification.input';
// import {ResetPasswordEmailInput} from 'apps/core/src/email/dto/reset-password-email.input';
import {BoolValue} from '@ezyfs/proto-schema/google/protobuf/wrappers.type';
import {map, Observable} from 'rxjs';
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
  async firstStageSignUp(
    @Args('firstStageUserInput') firstStageUserInput: FirstStageUserInput,
  ) {
    return this.registrationAuthorityService.firstStageSignUp(
      firstStageUserInput,
    );
  }

  @Mutation((returns) => User)
  secondStageSignUp(
    @Args('secondStageDTOInput') secondStageDTOInput: SecondStageDTOInput,
  ) {
    return this.registrationAuthorityService.secondStageSignUp(
      secondStageDTOInput,
    );
  }

  @Query((returns) => [User], {name: 'users'})
  // @Auth(UserRoleEnum.ADMIN)
  findAll(): Observable<User[]> {
    return this.registrationAuthorityService
      .findAll()
      .pipe(map((v, i) => v.users));
  }

  @Query((returns) => User, {name: 'user'})
  @Auth(UserRoleEnum.USER)
  findOne(@CurrentUser() user: User, @Args('id') id: number) {
    return this.registrationAuthorityService.findOne(user, id);
  }

  @Mutation((returns) => User)
  @Auth(UserRoleEnum.USER)
  update(
    @CurrentUser() user: User,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return this.registrationAuthorityService.update(user, updateUserInput);
  }

  @Mutation((returns) => User)
  @Auth(UserRoleEnum.USER)
  remove(@CurrentUser() user: User, @Args('id') id: number) {
    return this.registrationAuthorityService.remove(user, id);
  }

  @Mutation((returns) => TokenModel)
  confirmEmail(
    @Args('emailVerificationInput')
    emailVerificationInput: EmailVerificationInput,
  ) {
    return this.registrationAuthorityService.validUserConfirmation(
      emailVerificationInput,
    );
  }

  @Mutation((returns) => BoolValue)
  async sendResetPasswordEmail(
    @Args('ResetPasswordEmailInput')
    resetPasswordEmailInput: ResetPasswordEmailInput,
  ) {
    const x = await this.registrationAuthorityService
      .sendResetPasswordEmail(resetPasswordEmailInput)
      .toPromise();
    console.log('Return is ', x);
    return x;
  }

  @Mutation((returns) => BoolValue)
  resetPassword(
    @Args('ResetPasswordInput')
    resetPasswordInput: ResetPasswordInput,
  ) {
    return this.registrationAuthorityService.resetPassword(resetPasswordInput);
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
  login(
    @Args('credentialsInput') credentialsInput: CredentialsInput,
  ): Observable<TokenModel> {
    return this.registrationAuthorityService.login(credentialsInput);
  }

  @Query((returns) => TokenModel)
  refreshToken(
    @Args('refreshToken') refreshToken: string,
  ): Observable<TokenModel> {
    return this.registrationAuthorityService.refreshToken(refreshToken);
  }
}
