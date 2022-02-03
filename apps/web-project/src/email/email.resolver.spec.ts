// eslint-disable-next-line import/no-extraneous-dependencies
import {Test, TestingModule} from '@nestjs/testing';
import {EmailResolver} from './email.resolver';
import {EmailService} from './email.service';
import {Email} from './entities/email.entity';

describe('EmailResolver', () => {
  let resolver: EmailResolver;
  const emailMockService = {
    findAll: jest.fn(() => []),
    findOne: jest.fn((id) => ({
      id,
    })),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailResolver, EmailService],
    })
      .overrideProvider(EmailService)
      .useValue(emailMockService)
      .compile();

    resolver = module.get<EmailResolver>(EmailResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should return a list of all emails in db', () => {
    const allEmails: Email[] = [];
    expect(resolver.findAll()).toEqual(allEmails);
    expect(emailMockService.findAll).toBeCalledTimes(1);
  });
  it('should return an email with the specific id', () => {
    const id = 1;
    expect(resolver.findOne(id)).toMatchObject({id});
    expect(emailMockService.findOne).toBeCalledWith(id);
  });
});
