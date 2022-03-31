import {
  CreateUserInput,
  EmailVerificationInput,
  FirstStageUserInput,
  ResetPasswordEmailInput,
  ResetPasswordInput,
  SecondStageDTOInput,
  UpdateUserInput,
} from '@ezyfs/common/dtos';
import {BoolValue} from '@ezyfs/proto-schema';
import {User} from '@ezyfs/repositories/entities';
import {Observable} from 'rxjs';
import {TokenModel} from '../..';

export interface RegistrationAuthorityServiceRPC {
  userExistByEmail(input: {email: string}): Observable<BoolValue>;
  userExistByUsername(input: {username: string}): Observable<BoolValue>;
  firstStageSignUp(input: FirstStageUserInput): Observable<User>;
  secondStageSignUp(input: SecondStageDTOInput): Observable<User>;
  findAllUsers({}): Observable<{users: User[]}>;
  findOneUser(input: {user: User; id: number}): Observable<User>;
  updateUser(input: {
    user: User;
    updateUserInput: UpdateUserInput;
  }): Observable<User>;
  validUserConfirmation(input: EmailVerificationInput): Observable<TokenModel>;
  sendResetPasswordEmail(input: ResetPasswordEmailInput): Observable<BoolValue>;
  resetPassword(input: ResetPasswordInput): Observable<BoolValue>;
  removeUser(input: {user: User; id: number}): Observable<User>;
}
