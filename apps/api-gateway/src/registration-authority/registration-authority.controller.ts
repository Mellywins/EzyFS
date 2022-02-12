import {Controller} from '@nestjs/common';
import {RegistrationAuthorityService} from './registration-authority.service';

@Controller()
export class RegistrationAuthorityController {
  constructor(
    private readonly registrationAuthorityService: RegistrationAuthorityService,
  ) {}
}
