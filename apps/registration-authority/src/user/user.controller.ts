import {Controller} from '@nestjs/common';
import {GrpcMethod} from '@nestjs/microservices';
import {UserService} from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('RegistrationAuthorityService', 'UserExistByEmail')
  async UserExistByEmail(data: {email: string}) {
    return this.userService.UserExistByEmail(data.email);
  }

  @GrpcMethod('RegistrationAuthorityService', 'UserExistByUsername')
  UserExistByUsername(data: {email: string}) {
    return this.userService.UserExistByEmail(data.email);
  }
}
