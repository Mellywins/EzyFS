import {Controller} from '@nestjs/common';
import {GrpcMethod} from '@nestjs/microservices';
import {UserService} from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('RegistrationAuthorityService', 'UserExistByEmail')
  userExistByEmail(data: {email: string}) {
    return this.userService.userExistByEmail(data.email);
  }
}
