import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationAuthorityService } from './registration-authority.service';

describe('RegistrationAuthorityService', () => {
  let service: RegistrationAuthorityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegistrationAuthorityService],
    }).compile();

    service = module.get<RegistrationAuthorityService>(RegistrationAuthorityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
