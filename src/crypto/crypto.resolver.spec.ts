import { Test, TestingModule } from '@nestjs/testing';
import { CryptoResolver } from './crypto.resolver';
import { CryptoService } from './crypto.service';

describe('CryptoResolver', () => {
  let resolver: CryptoResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoResolver, CryptoService],
    }).compile();

    resolver = module.get<CryptoResolver>(CryptoResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
