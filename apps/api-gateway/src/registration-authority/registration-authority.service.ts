/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
import {TokenModel} from '@ezyfs/common';
import {
  CredentialsInput,
  EmailVerificationInput,
  FirstStageUserInput,
  ResetPasswordEmailInput,
  ResetPasswordInput,
  SecondStageDTOInput,
  UpdateUserInput,
} from '@ezyfs/common/dtos';
import {RegistrationAuthorityServiceRPC} from '@ezyfs/common/types/rpc/registration-authority';
import {GrpcGenericClientService} from '@ezyfs/internal/grpc-clients/grpc-generic-client.service';
import {GrpcToken} from '@ezyfs/internal/grpc-clients/types';
import {BoolValue} from '@ezyfs/proto-schema';
import {User} from '@ezyfs/repositories/entities';
import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {ClientGrpc} from '@nestjs/microservices';
import {Observable} from 'rxjs';

@Injectable()
export class RegistrationAuthorityService implements OnModuleInit {
  private registrationAuthorityRPC: RegistrationAuthorityServiceRPC;

  private AuthServiceRPC: any;

  constructor(private readonly grpcService: GrpcGenericClientService) {}

  onModuleInit() {
    this.registrationAuthorityRPC = this.grpcService
      .getService(GrpcToken.REGISTRATION_AUTHORITY)
      .getService<RegistrationAuthorityServiceRPC>(
        'RegistrationAuthorityService',
      );
    console.log(this.registrationAuthorityRPC);
    this.AuthServiceRPC = this.grpcService
      .getService(GrpcToken.REGISTRATION_AUTHORITY)
      .getService<any>('AuthentificationService');
  }

  async userExistByEmail(email: string): Promise<BoolValue> {
    return this.registrationAuthorityRPC.userExistByEmail({email}).toPromise();
  }

  userExistByUsername(username: string): Promise<BoolValue> {
    return this.registrationAuthorityRPC
      .userExistByUsername({username})
      .toPromise();
  }

  firstStageSignUp(firstStageDTO: FirstStageUserInput): Observable<User> {
    console.log(this.registrationAuthorityRPC);
    return this.registrationAuthorityRPC.firstStageSignUp(firstStageDTO);
  }

  secondStageSignUp(secondStageDTO: SecondStageDTOInput): Observable<User> {
    return this.registrationAuthorityRPC.secondStageSignUp(secondStageDTO);
  }

  findAll(): Observable<{users: User[]}> {
    return this.registrationAuthorityRPC.findAllUsers({});
  }

  findOne(user: User, id: number): Observable<User> {
    return this.registrationAuthorityRPC.findOneUser({user, id});
  }

  update(user: User, updateUserInput: UpdateUserInput): Observable<User> {
    return this.registrationAuthorityRPC.updateUser({user, updateUserInput});
  }

  remove(user: User, id: number): Observable<User> {
    return this.registrationAuthorityRPC.removeUser({user, id});
  }

  resetPassword(resetPasswordInput: ResetPasswordInput): Observable<BoolValue> {
    return this.registrationAuthorityRPC.resetPassword(resetPasswordInput);
  }

  login(credentials: CredentialsInput): Observable<TokenModel> {
    return this.AuthServiceRPC.login(credentials);
  }

  refreshToken(token: string): Observable<TokenModel> {
    return this.AuthServiceRPC.refreshToken({token});
  }

  validUserConfirmation(emailVerificationInput: EmailVerificationInput) {
    return this.registrationAuthorityRPC.validUserConfirmation(
      emailVerificationInput,
    );
  }

  sendResetPasswordEmail(
    resetPasswordEmailInput: ResetPasswordEmailInput,
  ): Observable<BoolValue> {
    return this.registrationAuthorityRPC.sendResetPasswordEmail(
      resetPasswordEmailInput,
    );
  }
}
