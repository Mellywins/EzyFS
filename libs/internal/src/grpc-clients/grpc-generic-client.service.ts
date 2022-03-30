import {Inject, Injectable} from '@nestjs/common';
import {ClientGrpc} from '@nestjs/microservices';

@Injectable()
export class GrpcGenericClientService {
  allowedServices: {token: string; client: ClientGrpc}[] = [];

  private availableServices: {token: string; client: ClientGrpc}[] = [];

  constructor(
    @Inject('REGISTRATION_AUTHORITY')
    private readonly registrationAuthorityClient: ClientGrpc,
    @Inject('NOTIFICATIONS') private readonly notificationsClient: ClientGrpc,
    @Inject('ServiceList')
    private readonly serviceList: {servicesList: string[]},
  ) {
    this.availableServices.push({
      client: this.registrationAuthorityClient,
      token: 'REGISTRATION_AUTHORITY',
    });
    this.availableServices.push({
      client: this.notificationsClient,
      token: 'NOTIFICATIONS',
    });
    console.log(this.serviceList);
    this.allowedServices = this.availableServices.filter((service) =>
      this.serviceList.servicesList.includes(service.token),
    );
    console.log(this.allowedServices);
  }

  public getService(token: string): ClientGrpc {
    return this.allowedServices.find((service) => service.token === token)
      .client;
  }
}
