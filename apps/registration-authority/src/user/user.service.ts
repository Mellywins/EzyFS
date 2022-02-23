/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  // Logger,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import * as bcrypt from 'bcrypt';
// eslint-disable-next-line import/no-unresolved
import {UserRoleEnum} from '@ezyfs/common/enums/user-role.enum';
// import {ProfileImgUpload} from '../profile-img-upload/entities/profile-img-upload.entity';

import {User} from '@ezyfs/repositories/entities';
import {EmailTypeEnum} from '@ezyfs/common/enums/email-type.enum';
import {
  SENDING_EMAIL_ERROR_MESSAGE,
  TokenModel,
  USER_NOT_FOUND_ERROR_MESSAGE,
} from '@ezyfs/common';
import {
  PayloadInterface,
  FirstStageUserInput,
  ResetPasswordInput,
  SecondStageDTOInput,
  UpdateUserInput,
} from '@ezyfs/common/dtos/registration-authority';
import {TokenTypeEnum} from '@ezyfs/common/enums';
import {RedisCacheService} from '@ezyfs/internal/modules/cache/redis-cache.service';
import {EmailVerificationInput} from '@ezyfs/common/dtos/registration-authority';
// import {EmailService} from '../email/email.service';
import {ResetPasswordEmailInput} from '@ezyfs/common/dtos/registration-authority';
import {CreateUserInput} from '@ezyfs/common/dtos/registration-authority';
import {ClientGrpc, GrpcMethod, RpcException} from '@nestjs/microservices';
import {BoolValue} from '@ezyfs/proto-schema';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class UserService {
  private emailNotificationsRPC: any;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly redisCacheService: RedisCacheService,
    // private readonly emailService: EmailService,
    private readonly authService: AuthService,
    @Inject('NOTIFICATIONS') private notificationsClient: ClientGrpc,
  ) {
    this.emailNotificationsRPC = this.notificationsClient.getService<any>(
      'EmailNotificationService',
    );
    console.log(this.emailNotificationsRPC);
  }

  async UserExistByEmail(email: string): Promise<BoolValue> {
    const user = await this.userRepository.findOne({
      where: {email},
    });
    if (user) {
      return {value: true};
    }
    return {value: false};
  }

  async UserExistByUsername(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: {username},
    });
    if (user) {
      return true;
    }
    return false;
  }
  // TODO:image upload config
  // async updateImage(user: number, imageId: ProfileImgUpload): Promise<string> {
  //   const response = await this.userRepository
  //     .update(user, {profileImage: imageId})
  //     .catch((e) => console.log)
  //     .then(
  //       (_) =>
  //         `Successfully updated ${user} profile picture with image id ${imageId}`,
  //     );
  //   return response;
  // }

  // THIS FUNCTION IS NOT USED IN RESOLVERS INSTEAD IT IS USED IN TESTS TO CREATE AND POPULATE DATA
  async create(createUserInput: CreateUserInput): Promise<User> {
    // check if the user is unique or not
    const checkUser = await this.userRepository.findOne({
      where: [
        {
          lowerCasedUsername: createUserInput.username.toLowerCase(),
        },
        {email: createUserInput.email},
      ],
    });
    if (!checkUser) {
      const user = await this.userRepository.create(createUserInput);
      user.lowerCasedUsername = user.username.toLowerCase();
      return this.userRepository.save(user);
      // send a confirmation to the user
      //     const isEmailSent: boolean = await this.emailService.sendEmail(
      //       user,
      //       EmailTypeEnum.CONFIRMATION,
      //     );
      //     if (isEmailSent) {
      //       return user;
      //     }
      //     throw new InternalServerErrorException(SENDING_EMAIL_ERROR_MESSAGE);
    }
    // if the user has the same username or email with someone else we throw an exception
    throw new HttpException('The User Already Exists', HttpStatus.BAD_REQUEST);
  }

  async firstStageSignUp(firstStageDTO: FirstStageUserInput) {
    // check if the user is unique or not
    const checkUser = await this.userRepository.findOne({
      where: [
        {
          lowerCasedUsername: firstStageDTO.username.toLowerCase(),
        },
        {email: firstStageDTO.email},
      ],
    });
    if (!checkUser) {
      const user = await this.userRepository.create(firstStageDTO);
      user.lowerCasedUsername = user.username.toLowerCase();
      user.completedSignUp = false;
      this.userRepository.save(user);

      // send a confirmation to the user
      const isEmailSent: boolean = await this.emailNotificationsRPC
        .sendEmail({
          user,
          emailType: EmailTypeEnum.CONFIRMATION,
        })
        .toPromise();
      if (isEmailSent) {
        return user;
      }
      throw new RpcException(SENDING_EMAIL_ERROR_MESSAGE);
    }
    // if the user has the same username or email with someone else we throw an exception
    throw new RpcException('The User Already Exists');
  }

  async secondStageSignUp(secondStageDTO: SecondStageDTOInput): Promise<User> {
    const {firstname, lastname, age, localization, telNumber, gender, id} =
      secondStageDTO;
    const user = await this.internalFindOne(id);
    if (user && user.isConfirmed) {
      user.completedSignUp = true;
      user.firstname = firstname;
      user.lastname = lastname;
      user.age = age;
      user.localization = localization;
      user.telNumber = telNumber;
      user.gender = gender;

      return this.userRepository.save(user);
    }
    throw new RpcException('BAD_INCOMING_REQUEST');
  }

  async findAll(): Promise<{users: User[]}> {
    const users = await this.userRepository.find();
    console.log(users);
    return {users};
  }

  async findOne(user: User, id: number): Promise<User> {
    if (this.checkAuthorities(user, id)) {
      return this.userRepository.findOne({where: {id}});
    }
    throw new UnauthorizedException();
  }

  // this function is for internal use
  async internalFindOne(id: number): Promise<User> {
    return this.userRepository.findOne({where: {id}});
  }

  async update(
    currentUser: User,
    userId: number,
    updateUserInput: UpdateUserInput,
  ): Promise<User> {
    // this will throw an error if the current user does not have the right to update.
    const user = await this.findOne(currentUser, userId);

    // we check if the user is not found in the database we couldn't update so we throw an exception
    if (!user) {
      throw new HttpException('User Not Found!', HttpStatus.NOT_FOUND);
    } else {
      const {id, ...data} = updateUserInput;
      await this.userRepository
        .update(userId, data)
        .then((updatedUser) => updatedUser.raw[0]);
      return this.findOne(currentUser, userId);
    }
  }

  async remove(user, id: number): Promise<User> {
    const userToRemove = await this.findOne(user, id);
    await this.userRepository.delete(id);
    return userToRemove;
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({where: {username}});
  }

  // a method which check the authority of a user
  checkAuthorities(user: User, id: number): boolean {
    // If the user is admin he has all authorities
    if (user.roles.indexOf(UserRoleEnum.ADMIN) > -1) {
      return true;
    }
    // else we check if the user who demand to find userById correspond to the actual user in database or not.
    return user.id === id;
  }

  /*
      if email confirmation is true it means that the user confirm the registration in a maximum of two days
      so we should update the user and make his confirmation attribute to true
      else we should delete him from database so he could make another registration with the same data (email, username etc..)
    */
  // eslint-disable-next-line consistent-return
  async validUserConfirmation(
    emailVerificationInput: EmailVerificationInput,
  ): Promise<TokenModel> {
    const {userId, token, verificationToken} = emailVerificationInput;
    const user: User = await this.userRepository.findOne({where: {id: userId}});
    if (user) {
      const emailConfirmation = await this.emailNotificationsRPC.confirmEmail({
        user,
        token,
        verificationToken,
        emailType: EmailTypeEnum.CONFIRMATION,
      });
      if (emailConfirmation) {
        user.isConfirmed = true;
        await this.userRepository.save(user);
        return this.generateTokenModel(user);
      }
      // if the user account is not confirmed we should delete his account so he can try another registration
      if (user.isConfirmed === false) {
        await this.userRepository.delete(userId);
      }
    } else {
      throw new NotFoundException(USER_NOT_FOUND_ERROR_MESSAGE);
    }
  }

  async sendResetPasswordEmail(
    resetPasswordEmail: ResetPasswordEmailInput,
  ): Promise<BoolValue> {
    const {email} = resetPasswordEmail;
    const user: User = await this.userRepository.findOne({where: {email}});
    if (user) {
      const isEmailSent: boolean = await this.emailNotificationsRPC.sendEmail({
        user,
        emailType: EmailTypeEnum.RESET_PASSWORD,
      });
      if (isEmailSent) {
        return {value: isEmailSent};
      }
      throw new InternalServerErrorException(SENDING_EMAIL_ERROR_MESSAGE);
    } else {
      throw new NotFoundException(USER_NOT_FOUND_ERROR_MESSAGE);
    }
  }

  async resetPassword(
    resetPasswordInput: ResetPasswordInput,
  ): Promise<BoolValue> {
    const {email, password, token, verificationToken} = resetPasswordInput;
    const user: User = await this.userRepository.findOne({where: {email}});
    if (user) {
      const emailConfirmation = await this.emailNotificationsRPC.confirmEmail({
        user,
        token,
        verificationToken,
        emailType: EmailTypeEnum.RESET_PASSWORD,
      });
      if (emailConfirmation) {
        user.password = await bcrypt.hash(password, user.salt);
        await this.userRepository.save(user);
      }
      return {value: emailConfirmation};
    }
    throw new NotFoundException(USER_NOT_FOUND_ERROR_MESSAGE);
  }

  async generateTokenModel(user: User): Promise<TokenModel> {
    const payload: PayloadInterface = {
      username: user.username,
      email: user.email,
    };
    const accessToken = await this.authService.generateJwtToken(
      payload,
      TokenTypeEnum.ACCESS,
    );
    const refreshToken = await this.authService.generateJwtToken(
      payload,
      TokenTypeEnum.REFRESH,
    );
    // add the new refresh token to the cache
    await this.redisCacheService.set(user.username, refreshToken);
    return {user, accessToken, refreshToken};
  }
}
