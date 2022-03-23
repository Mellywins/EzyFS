/* eslint-disable import/no-unresolved */
import {TokenModel} from '@ezyfs/common';
import {
  EmailVerificationInput,
  FirstStageUserInput,
  ResetPasswordEmailInput,
  ResetPasswordInput,
  SecondStageDTOInput,
  UpdateUserInput,
} from '@ezyfs/common/dtos';
import {BoolValue} from '@ezyfs/proto-schema';
import {User} from '@ezyfs/repositories';
import {Controller} from '@nestjs/common';
import {GrpcMethod} from '@nestjs/microservices';
import {UserService} from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('RegistrationAuthorityService', 'UserExistByEmail')
  async UserExistByEmail(data: {email: string}) {
    return this.userService.UserExistByEmail(data.email);
  }

  @GrpcMethod('RegistrationAuthorityService', 'UserExistByUsername')
  UserExistByUsername(data: {email: string}) {
    return this.userService.UserExistByEmail(data.email);
  }

  @GrpcMethod('RegistrationAuthorityService', 'FirstStageSignUp')
  async FirstStageSignUp(firstStageDTO: FirstStageUserInput) {
    return this.userService.firstStageSignUp(firstStageDTO);
  }

  @GrpcMethod('RegistrationAuthorityService', 'SecondStageSignUp')
  SecondStageSignUp(secondStageDTO: SecondStageDTOInput) {
    return this.userService.secondStageSignUp(secondStageDTO);
  }

  @GrpcMethod('RegistrationAuthorityService', 'FindAllUsers')
  FindAllUsers() {
    return this.userService.findAll();
  }

  @GrpcMethod('RegistrationAuthorityService', 'FindOneUser')
  FindOneUser(input: {user: User; id: number}) {
    return this.userService.findOne(input.user, input.id);
  }

  @GrpcMethod('RegistrationAuthorityService', 'UpdateUser')
  UpdateUser(input: {
    currentUser: User;
    userId: number;
    updateUserInput: UpdateUserInput;
  }) {
    return this.userService.update(
      input.currentUser,
      input.userId,
      input.updateUserInput,
    );
  }

  @GrpcMethod('RegistrationAuthorityService', 'ValidUserConfirmation')
  validUserConfirmation(
    emailVerificationInput: EmailVerificationInput,
  ): Promise<TokenModel> {
    return this.userService.validUserConfirmation(emailVerificationInput);
  }

  @GrpcMethod('RegistrationAuthorityService', 'SendResetPasswordEmail')
  sendResetPasswordEmail(
    resetPasswordemail: ResetPasswordEmailInput,
  ): Promise<BoolValue> {
    return this.userService.sendResetPasswordEmail(resetPasswordemail);
  }

  @GrpcMethod('RegistrationAuthorityService', 'ResetPassword')
  resetPassword(resetPasswordInput: ResetPasswordInput) {
    return this.userService.resetPassword(resetPasswordInput);
  }
  // ---------- INTERNAL SERVICES ---------- //
  @GrpcMethod('RegistrationAuthorityInternalService', 'InternalFindOne')
  internalFindOne(input: {id: number}) {
    return this.userService.internalFindOne(input.id);
  }
}
