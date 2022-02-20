import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '@ezyfs/repositories/entities';
import {RedisCacheModule} from '@ezyfs/internal/modules/cache/redis-cache.module';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {join} from 'path';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {AuthModule} from '../auth/auth.module';
import {ChannelCredentials} from '@grpc/grpc-js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RedisCacheModule,
    AuthModule,
    ClientsModule.register([
      {
        name: 'NOTIFICATIONS',
        transport: Transport.GRPC,
        options: {
          package: 'NOTIFICATIONS',
          url: '172.28.1.4:3005',
          protoPath: join(
            `${process.cwd()}/libs/proto-schema/src/proto/notifications.proto`,
          ),
          credentials: ChannelCredentials.createInsecure(),
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
