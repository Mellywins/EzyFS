/* eslint-disable class-methods-use-this */
import {Injectable} from '@nestjs/common';

@Injectable()
export class ApiGatewayService {
  getHello(): string {
    return 'Hello World!';
  }
}
