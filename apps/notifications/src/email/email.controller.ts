import {Controller} from '@nestjs/common';
import {EmailService} from './email.service';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
}
