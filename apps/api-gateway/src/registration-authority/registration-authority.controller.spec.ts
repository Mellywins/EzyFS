import {Test, TestingModule} from '@nestjs/testing';
import {RegistrationAuthorityController} from './registration-authority.controller';
import {RegistrationAuthorityService} from './registration-authority.service';

describe('RegistrationAuthorityController', () => {
  let controller: RegistrationAuthorityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistrationAuthorityController],
      providers: [RegistrationAuthorityService],
    }).compile();

    controller = module.get<RegistrationAuthorityController>(
      RegistrationAuthorityController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
