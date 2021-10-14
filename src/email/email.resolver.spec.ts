import { Test, TestingModule } from '@nestjs/testing';
import { EmailResolver } from './email.resolver';
import { EmailService } from './email.service';

describe('EmailResolver', () => {
  let resolver: EmailResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailResolver, EmailService],
    }).compile();

    resolver = module.get<EmailResolver>(EmailResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
