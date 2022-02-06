/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {EmailVerificationInput} from '../email/dto/email-verification.input';
import {ResetPasswordEmailInput} from '../email/dto/reset-password-email.input';
import {RedisCacheService} from '../redis-cache/redis-cache.service';
import {EmailService} from '../email/email.service';
import {ResetPasswordInput} from './dto/reset-password.input';
import {User} from './entities/user.entity';
import {UserService} from './user.service';
import {AuthService} from '../auth/auth.service';

describe('UserService', () => {
  let service: UserService;
  const mockUserRepository = {
    create: jest.fn().mockImplementation(async (dto) =>
      Promise.resolve({
        id: 1,
        ...dto,
      }),
    ),
    findOne: jest.fn().mockImplementation(async ({username, email}) => {
      const user = new User();
      user.salt = '$2b$10$FVO2GB0ICX8SvZ9mgRCocu';
      return Promise.resolve(user);
    }),
    save: jest.fn().mockImplementation(async (dto) =>
      Promise.resolve({
        id: 1,
        ...dto,
      }),
    ),
  };
  const mockEmailService = {
    sendEmail: jest
      .fn()
      .mockImplementation(async (user, emailType) => Promise.resolve(true)),
    confirmEmail: jest
      .fn()
      .mockImplementation(async (emailVerificationInput) =>
        Promise.resolve(true),
      ),
  };
  const mockRedisCacheService = {
    set: jest.fn().mockImplementation((username, refreshToken) => {}),
  };
  const mockAuthService = {
    generateJwtToken: jest.fn().mockResolvedValue('accessToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        RedisCacheService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        EmailService,
        AuthService,
      ],
    })
      .overrideProvider(EmailService)
      .useValue(mockEmailService)
      .overrideProvider(RedisCacheService)
      .useValue(mockRedisCacheService)
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should create a user', async () => {
  //   const createUserInput: CreateUserInput = {
  //     username: 'oussema',
  //     email: 'zouaghi.wow1919@gmail.com',
  //   } as CreateUserInput;
  //   expect(await service.create(createUserInput)).toBeDefined();
  //   expect(mockUserRepository.findOne).toBeCalled();
  //   expect(mockUserRepository.create).toBeCalledWith(createUserInput);
  //   expect(mockEmailService.sendEmail).toBeCalled();
  // });

  it('should valid the user confirmation', async () => {
    const emailVerificationInput: EmailVerificationInput = {
      userId: 1,
      token: 'token',
      verificationToken: 'verificationToken',
    };
    expect(
      await service.validUserConfirmation(emailVerificationInput),
    ).toBeDefined();
    expect(mockUserRepository.findOne).toBeCalled();
    expect(mockUserRepository.save).toBeCalled();
    expect(mockEmailService.confirmEmail).toBeCalled();
  });

  it('should send the reset password email for the user', async () => {
    const resetPasswordEmailInput: ResetPasswordEmailInput = {
      email: 'zouaghi.wow1919@gmail.com',
    };
    expect(
      await service.sendResetPasswordEmail(resetPasswordEmailInput),
    ).toBeDefined();
    expect(mockUserRepository.findOne).toBeCalled();
    expect(mockEmailService.sendEmail).toBeCalled();
  });

  it('should reset the password of the user', async () => {
    const resetPasswordInput: ResetPasswordInput = {
      email: 'zouaghi.wow1919@gmail.com',
      password: 'pass',
      token: 'token',
      verificationToken: 'verificationToken',
    };
    expect(await service.resetPassword(resetPasswordInput)).toBeDefined();
    expect(mockUserRepository.findOne).toBeCalled();
    expect(mockEmailService.confirmEmail).toBeCalled();
  });
});
