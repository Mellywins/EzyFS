import {Test, TestingModule} from '@nestjs/testing';
import {RegistrationAuthorityController} from './registration-authority.controller';
import {RegistrationAuthorityService} from './registration-authority.service';

describe('RegistrationAuthorityController', () => {
  let registrationAuthorityController: RegistrationAuthorityController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RegistrationAuthorityController],
      providers: [RegistrationAuthorityService],
    }).compile();

    registrationAuthorityController = app.get<RegistrationAuthorityController>(
      RegistrationAuthorityController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(registrationAuthorityController.getHello()).toBe('Hello World!');
    });
  });
});
