import {Inject, Injectable, Logger} from '@nestjs/common';
import {ClientGrpc} from '@nestjs/microservices';

@Injectable()
export class GrpcGenericClientService {
  allowedServices: {token: string; client: ClientGrpc}[] = [];

  private availableServices: {token: string; client: ClientGrpc}[] = [];

  private readonly logger = new Logger(GrpcGenericClientService.name);

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
    this.allowedServices = this.availableServices.filter((service) =>
      this.serviceList.servicesList.includes(service.token),
    );
    this.logger.log(
      `Microservices within reach: ${this.stringifyAvailableServices(
        serviceList.servicesList,
      )}`,
    );
  }

  public getService(token: string): ClientGrpc {
    return this.allowedServices.find((service) => service.token === token)
      .client;
  }

  // eslint-disable-next-line class-methods-use-this
  private stringifyAvailableServices(services: string[]) {
    return services.map((service) => `${service}`).join(', ');
  }
}
