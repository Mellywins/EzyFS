import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {PayloadInterface} from '@ezyfs/common/dtos/registration-authority/payload.interface';
import {User} from '@ezyfs/repositories/entities';
import {RpcException} from '@nestjs/microservices';
import {ConsulService} from 'nestjs-consul';
import {RegistrationAuthorityConfig} from '@ezyfs/internal';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly consul: ConsulService<RegistrationAuthorityConfig>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject('ConsulSync') consulSync: RegistrationAuthorityConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: consulSync.auth.jwtSettings.jwtSecret,
    });
  }

  async validate(payload: PayloadInterface) {
    const {username} = payload;
    const user = await this.userRepository.findOne({where: {username}});

    // if the user is not null or undefined which means that we find it
    if (user) {
      delete user.salt;
      delete user.password;
      return user;
    }
    // if we don't find the user it means that he's unauthorized
    throw new RpcException('UNAUTHORIZED');
  }
}
