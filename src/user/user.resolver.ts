/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {Resolver, Query, Mutation, Args} from '@nestjs/graphql';
import {UserService} from './user.service';
import {UpdateUserInput} from './dto/update-user.input';
import {User} from './entities/user.entity';
import {CurrentUser} from '../shared/decorators/current-user.decorator';
import {UserRoleEnum} from './entities/user-role.enum';
import {Auth} from '../shared/decorators/auth.decorator';
import {EmailVerificationInput} from '../email/dto/email-verification.input';
import {ResetPasswordEmailInput} from '../email/dto/reset-password-email.input';
import {ResetPasswordInput} from './dto/reset-password.input';
import {FirstStageUserInput} from './dto/first-stage-user.input';
import {SecondStageDTOInput} from './dto/second-stage-user.input';
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
