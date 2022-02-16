/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
import {Inject, Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import {User} from '@ezyfs/repositories/entities';
import {
  CredentialsInput,
  PayloadInterface,
} from '@ezyfs/common/dtos/registration-authority';
import {
  PASSWORD_LOGIN_MISSMATCH_ERROR_MESSAGE,
  ACCOUNT_NOT_ACTIVATED_ERROR_MESSAGE,
} from '@ezyfs/common/constants';
import {TokenTypeEnum} from '@ezyfs/common/enums';
import {RedisCacheService} from '@ezyfs/internal/modules/cache/redis-cache.service';
import {RpcException} from '@nestjs/microservices';
import {ConsulService} from 'nestjs-consul';
import {ConsulServiceKeys, RegistrationAuthorityConfig} from '@ezyfs/internal';
import {TokenModel} from '@ezyfs/common/types';

dotenv.config();
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    @Inject('ConsulSync') private readonly consul: RegistrationAuthorityConfig,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.userRepository.findOne({where: {username}});
    if (user && user.password === pass) {
      const {password, ...result} = user;
      return result;
    }
    return null;
  }

  // eslint-disable-next-line consistent-return
  async generateJwtToken(payload: PayloadInterface, tokenType: TokenTypeEnum) {
    switch (tokenType) {
      case TokenTypeEnum.ACCESS:
        return this.jwtService.sign(payload);
      case TokenTypeEnum.REFRESH:
        return this.jwtService.sign(payload, {
          secret: this.consul.auth.jwtSettings.refreshTokenSecret,
          expiresIn: '1y',
        });
    }
  }

  async verifyRefreshToken(refreshToken: string) {
    const payload = await this.jwtService.verify(refreshToken, {
      secret: this.consul.auth.jwtSettings.refreshTokenSecret,
    });
    if (payload) {
      const {iat, exp, ...data} = payload;
      return data;
    }
    throw new RpcException('UNAUTHORIZED');
  }

  async refreshToken(refreshToken: string): Promise<TokenModel> {
    const payload = await this.verifyRefreshToken(refreshToken);
    if (payload) {
      const {username} = payload;
      const storedRefreshToken = await this.redisCacheService.get(username);
      if (storedRefreshToken === refreshToken) {
        const newAccessToken = await this.generateJwtToken(
          payload,
          TokenTypeEnum.ACCESS,
        );
        const newRefreshToken = await this.generateJwtToken(
          payload,
          TokenTypeEnum.REFRESH,
        );
        const user = await this.userRepository.findOne({
          where: {username},
        });
        await this.redisCacheService.set(username, newRefreshToken);
        return {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          user,
        };
      }
      throw new RpcException('UNAUTHORIZED');
    } else {
      throw new RpcException('UNAUTHORIZED');
    }
  }

  async login(credentials: CredentialsInput): Promise<TokenModel> {
    const {username, password} = credentials;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username or user.email = :username', {username})
      .getOne();

    // if the user is null is means that we don't have any user with that email or password
    if (!user) {
      throw new RpcException(PASSWORD_LOGIN_MISSMATCH_ERROR_MESSAGE);
    } else if (!user.isConfirmed) {
      throw new RpcException(ACCOUNT_NOT_ACTIVATED_ERROR_MESSAGE);
    } else {
      // if we get the user
      const hashedPassword = await bcrypt.hash(password, user.salt);
      // if the password is correct we sign the jwt and return it from the payload
      if (hashedPassword === user.password) {
        const payload: PayloadInterface = {
          username: user.username,
          email: user.email,
        };
        const accessToken = await this.generateJwtToken(
          payload,
          TokenTypeEnum.ACCESS,
        );
        const refreshToken = await this.generateJwtToken(
          payload,
          TokenTypeEnum.REFRESH,
        );
        // add the new refresh token to the cache
        await this.redisCacheService.set(user.username, refreshToken);
        // return result
        return {
          accessToken,
          refreshToken,
          user,
        };
      }
      // if the password is not equal to user.password that means that the credentials are not true
      throw new RpcException(PASSWORD_LOGIN_MISSMATCH_ERROR_MESSAGE);
    }
  }
}
