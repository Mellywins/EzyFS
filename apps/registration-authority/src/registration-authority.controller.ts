import { Controller, Get } from '@nestjs/common';
import { RegistrationAuthorityService } from './registration-authority.service';

@Controller()
export class RegistrationAuthorityController {
  constructor(private readonly registrationAuthorityService: RegistrationAuthorityService) {}

  @Get()
  getHello(): string {
    return this.registrationAuthorityService.getHello();
  }
}
