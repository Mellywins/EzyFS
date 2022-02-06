/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {MailerModule, MailerService} from '@nestjs-modules/mailer';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {join} from 'path';
import {QueryBuilder, QueryRunner, SelectQueryBuilder} from 'typeorm';
import {User} from '../user/entities/user.entity';
import {emailCredentials} from '../config/email-config-service';
import {CreateEmailInput} from './dto/create-email.input';
import {EmailService} from './email.service';
import {EmailTypeEnum} from './entities/email-type.enum';
import {Email} from './entities/email.entity';

describe('EmailService', () => {
  let service: EmailService;
  const mockEmailRepository = {
    create: jest
      .fn()
      .mockImplementation((dto) => Promise.resolve({id: 1, ...dto})),
    save: jest.fn().mockImplementation((email) => Promise.resolve(email)),
  };
  const mailerServiceMock = {
    sendMail: jest.fn().mockImplementation((dto) => Promise.resolve(dto)),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: getRepositoryToken(Email),
          useValue: mockEmailRepository,
        },
      ],
      imports: [
        MailerModule.forRoot({
          transport: {
            host: 'smtp.gmail.com',
            port: 587,
            auth: emailCredentials,
          },
          defaults: {
            from: 'project.tech@gmail.com',
          },
          template: {
            dir: join(process.cwd(), 'src/templates'),
            adapter: new HandlebarsAdapter(),
          },
        }),
      ],
    })
      .overrideProvider(MailerService)
      .useValue(mailerServiceMock)
      .compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and save an email', async () => {
    const dto = new Email();
    expect(await service.create(dto)).toEqual({
      id: 1,
    });
  });

  it('should send an email to a specific user', async () => {
    const user = new User();
    expect(await service.sendEmail(user, EmailTypeEnum.CONFIRMATION)).toEqual(
      true,
    );
    expect(mailerServiceMock.sendMail).toBeCalledTimes(1);
  });
});
