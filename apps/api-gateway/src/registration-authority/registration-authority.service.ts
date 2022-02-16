/* eslint-disable camelcase */
import {
  CredentialsInput,
  FirstStageUserInput,
  ResetPasswordInput,
  SecondStageDTOInput,
  UpdateUserInput,
} from '@ezyfs/common/dtos';
import {BoolValue} from '@ezyfs/proto-schema';
import {User} from '@ezyfs/repositories/entities';
import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {ClientGrpc} from '@nestjs/microservices';
import {Observable} from 'rxjs';

@Injectable()
export class RegistrationAuthorityService implements OnModuleInit {
  private registrationAuthorityRPC: any;

  constructor(@Inject('RA') private RA_Client: ClientGrpc) {}

  onModuleInit() {
    this.registrationAuthorityRPC = this.RA_Client.getService<any>(
      'RegistrationAuthorityService',
    );
  }

  async userExistByEmail(email: string): Promise<BoolValue> {
    return this.registrationAuthorityRPC.userExistByEmail({email});
  }

  userExistByUsername(username: string): Promise<BoolValue> {
    return this.registrationAuthorityRPC.userExistByUsername({username});
  }

  firstStageSignUp(firstStageDTO: FirstStageUserInput): Observable<User> {
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

  resetPassword(resetPasswordInput: ResetPasswordInput): Observable<User> {
    return this.registrationAuthorityRPC.resetPassword(resetPasswordInput);
  }
}
