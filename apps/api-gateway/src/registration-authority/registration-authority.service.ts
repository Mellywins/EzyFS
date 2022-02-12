/* eslint-disable camelcase */
import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {ClientGrpc} from '@nestjs/microservices';

@Injectable()
export class RegistrationAuthorityService implements OnModuleInit {
  private registrationAuthorityService: any;

  constructor(@Inject('RA') private RA_Client: ClientGrpc) {}

  onModuleInit() {
    this.registrationAuthorityService = this.RA_Client.getService<any>(
      'RegistrationAuthorityService',
    );
  }

  userExistByEmail(email: string) {
    return this.registrationAuthorityService.userExistByEmail(email);
  }

  userExistByUsername(username: string) {
    return this.registrationAuthorityService.userExistByUsername(username);
  }
}
