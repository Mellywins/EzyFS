/* eslint-disable camelcase */
import {BoolValue} from '@ezyfs/proto-schema';
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
}
