import { Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { CryptoResolver } from './crypto.resolver';

@Module({
  providers: [CryptoResolver, CryptoService]
})
export class CryptoModule {}
