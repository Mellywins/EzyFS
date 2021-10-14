/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {EmailVerificationInput} from '../email/dto/email-verification.input';
import {ResetPasswordEmailInput} from '../email/dto/reset-password-email.input';
import {FirstStageUserInput} from './dto/first-stage-user.input';
import {ResetPasswordInput} from './dto/reset-password.input';
import {SecondStageDTOInput} from './dto/second-stage-user.input';
import {Gender} from './entities/gender';
import {User} from './entities/user.entity';
import {UserResolver} from './user.resolver';
import {UserService} from './user.service';

describe('UserResolver', () => {
  let resolver: UserResolver;
  const firstStageUser = new User();
  firstStageUser.username = 'oussema';
  firstStageUser.password = 'pass123';
  firstStageUser.email = 'oussema@gmail.com';

  const secondStageUser = new User();
  secondStageUser.isConfirmed = true;
  secondStageUser.completedSignUp = true;

  const userMockService = {
    create: jest.fn((dto) => ({
      ...dto,
    })),
    findAll: jest.fn(() => []),
    findOne: jest.fn((user, id) => ({
      ...user,
      email: 'zouaghi.wow1919@gmail.com',
      id,
    })),
    validUserConfirmation: jest.fn((emailConfirmationInput) => true),
    sendResetPasswordEmail: jest.fn((resetPasswordEmailInput) => true),
    resetPassword: jest.fn((resetPasswordInput) => true),
    firstStageSignUp: jest.fn().mockReturnValue(firstStageUser),
    secondStageSignUp: jest.fn().mockReturnValue(secondStageUser),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserResolver, UserService],
    })
      .overrideProvider(UserService)
      .useValue(userMockService)
      .compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should perform the first stage of the sign up', async () => {
    const firstStageInputDTO: FirstStageUserInput = {
      email: 'oussema@gmail.com',
      username: 'oussema',
      password: 'pass123',
    };
    expect(resolver.firstStageSignUp).toBeDefined();
    expect(resolver.firstStageSignUp(firstStageInputDTO)).toMatchObject(
      firstStageUser,
    );
    expect(
      await (
        await resolver.firstStageSignUp(firstStageUser)
      ).isConfirmed,
    ).toBeFalsy();
    expect(
      await (
        await resolver.firstStageSignUp(firstStageUser)
      ).completedSignUp,
    ).toBeFalsy();
    expect(userMockService.firstStageSignUp).toBeCalledWith(firstStageInputDTO);
  });

  it('should perform the second stage of the sign up', async () => {
    const secondStageDTOInput: SecondStageDTOInput = {
      firstname: 'oussema',
      lastname: 'zouaghi',
      age: 20,
      id: 1,
      localization: 'Tunis',
      telNumber: '+216 27221096',
      gender: Gender.MALE,
    };
    expect(resolver.secondStageSignUp).toBeDefined();
    expect(resolver.secondStageSignUp(secondStageDTOInput)).toMatchObject(
      secondStageUser,
    );
    expect(
      await (
        await resolver.secondStageSignUp(firstStageUser)
      ).isConfirmed,
    ).toBeTruthy();
    expect(
      await (
        await resolver.secondStageSignUp(firstStageUser)
      ).completedSignUp,
    ).toBeTruthy();
    expect(userMockService.secondStageSignUp).toBeCalledWith(
      secondStageDTOInput,
    );
  });

  // it('should return a user after creating it', () => {
  //   const dto: CreateUserInput = {
  //     firstname: 'oussema',
  //     lastname: 'zouaghi',
  //     age: 25,
  //     email: 'zouaghi.wow1919@gmail.com',
  //     username: 'oussema zouaghi',
  //     roles: ['admin'],
  //     password: 'oussema',
  //     localization: 'Tunis',
  //     telNumber: '+216 27221096',
  //     rate: 5,
  //     gender: Gender.MALE,
  //     id: 1,
  //   };
  //   expect(resolver.createUser(dto)).toMatchObject(dto);
  //   expect(userMockService.create).toHaveBeenCalledWith(dto);
  // });

  it('should return list of all users', () => {
    const allUsers: User[] = [];
    expect(resolver.findAll()).toEqual(allUsers);
    expect(userMockService.findAll).toHaveBeenCalledWith();
  });

  it('should return a user that match with the specific id', () => {
    const id = 1;
    const user = {email: 'zouaghi.wow1919@gmail.com', id};
    expect(resolver.findOne(user as User, id)).toMatchObject(user);
    expect(userMockService.findOne).toHaveBeenCalledTimes(1);
    expect(userMockService.findOne).toHaveBeenCalledWith(user as User, id);
  });

  it('should confirm a user account using the sent email', () => {
    const emailVerificationInput: EmailVerificationInput = {
      token: 'token',
      verificationToken: 'verificationToken',
      userId: 1,
    };
    expect(resolver.confirmEmail(emailVerificationInput)).toEqual(true);
    expect(userMockService.validUserConfirmation).toHaveBeenCalledWith(
      emailVerificationInput,
    );
  });

  it('should send a reset password email', () => {
    const resetPasswordEmailInput: ResetPasswordEmailInput = {
      email: 'zouaghi.wow1919@gmail.com',
    };
    expect(resolver.sendResetPasswordEmail(resetPasswordEmailInput)).toEqual(
      true,
    );
    expect(userMockService.sendResetPasswordEmail).toHaveBeenCalledWith(
      resetPasswordEmailInput,
    );
  });

  it('should reset the password of a given user', () => {
    const resetPasswordInput: ResetPasswordInput = {
      email: 'zouaghi.wow1919@gmail.com',
      password: 'pass123',
      token: 'token',
      verificationToken: 'verifToken',
    };
    expect(resolver.resetPassword(resetPasswordInput)).toEqual(true);
    expect(userMockService.resetPassword).toHaveBeenCalledWith(
      resetPasswordInput,
    );
  });
});
