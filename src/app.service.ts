import {Injectable} from '@nestjs/common';

@Injectable()
// eslint-disable-next-line import/prefer-default-export
export class AppService {
  // eslint-disable-next-line class-methods-use-this
  getHello(): string {
    return 'Hello World!';
  }
}
