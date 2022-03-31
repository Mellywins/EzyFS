import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '@ezyfs/repositories/entities';
import {RedisCacheModule} from '@ezyfs/internal/modules/cache/redis-cache.module';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {join} from 'path';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {AuthModule} from '../auth/auth.module';
import {GrpcGenericClientModule} from '@ezyfs/internal/grpc-clients/grpc-generic-client.module';
import {GrpcToken} from '@ezyfs/internal/grpc-clients/types';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RedisCacheModule,
    AuthModule,
    GrpcGenericClientModule.registerAsync({
      servicesList: [GrpcToken.NOTIFICATIONS],
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
