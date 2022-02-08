import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {EnvironmentVariables} from '@ezyfs/common/types';
import {PayloadInterface} from '../dto/payload.interface';
import {User} from '@ezyfs/repositories/entities';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
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
    throw new UnauthorizedException();
  }
}
