import {
  CreateUserInput,
  EmailVerificationInput,
  ResetPasswordEmailInput,
  ResetPasswordInput,
  SecondStageDTOInput,
  UpdateUserInput,
} from '@ezyfs/common/dtos';
import {User} from '@ezyfs/repositories/entities';
import {Observable} from 'rxjs';
import {TokenModel} from '../..';

export interface RegistrationAuthorityInternalServiceRPC {
  userExistByEmail(input: {email: string}): Observable<{value: boolean}>;
  userExistByUsername(input: {username: string}): Observable<{value: boolean}>;
  firstStageSignUp(input: CreateUserInput): Observable<User>;
  secondStageSignUp(input: SecondStageDTOInput): Observable<User>;
  findAllUsers(): Observable<User[]>;
  findOneUser(input: {user: User; id: number}): Observable<User>;
  updateUser(input: UpdateUserInput): Observable<User>;
  validUserConfirmation(input: EmailVerificationInput): Observable<TokenModel>;
  sendResetPasswordEmail(input: ResetPasswordEmailInput): Observable<boolean>;
  resetPassword(input: ResetPasswordInput): Observable<{value: boolean}>;
}
