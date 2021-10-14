import {Resolver, Query, Mutation, Args} from '@nestjs/graphql';
import {UserService} from './user.service';
import {CreateUserInput} from './dto/create-user.input';
import {UpdateUserInput} from './dto/update-user.input';
import {User} from './entities/user.entity';
import {forwardRef, Inject, Logger, UseGuards} from '@nestjs/common';
import {GqlAuthGuard} from '../shared/guards/gql-auth-guard';
import {CurrentUser} from '../shared/decorators/current-user.decorator';
import {AuthService} from '../auth/auth.service';
import {CredentialsInput} from '../auth/dto/credentials.input';
import {Roles} from '../shared/decorators/roles.decorator';
import {UserRoleEnum} from './entities/user-role.enum';
import {RolesGuard} from '../shared/guards/roles.guards';
import {Auth} from '../shared/decorators/auth.decorator';
import {EmailVerificationInput} from '../email/dto/email-verification.input';
import {ResetPasswordEmailInput} from '../email/dto/reset-password-email.input';
import {ResetPasswordInput} from './dto/reset-password.input';
import {TrimDataPipe} from '../shared/pipes/trim-data.pipe';
import {FirstStageDTOInput} from './dto/first-stage-dto.input';
import {SecondStageDTOInput} from './dto/second-stage-dto.input';
import {TokenModel} from '../auth/dto/token.model';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // @Mutation((returns) => User)
  // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return this.userService.create(createUserInput);
  // }

  @Mutation((returns) => User)
  firstStageSignUp(
    @Args('firstStageDTOInput') firstStageDTOInput: FirstStageDTOInput,
  ) {
    return this.userService.firstStageSignUp(firstStageDTOInput);
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
