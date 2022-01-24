import {Test, TestingModule} from '@nestjs/testing';
import {CryptoResolver} from './crypto.resolver';
import {CryptoService} from './crypto.service';

describe('CryptoResolver', () => {
  let resolver: CryptoResolver;
  const mockCryptoService = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoResolver, CryptoService],
    })
      .overrideProvider(CryptoService)
      .useValue(mockCryptoService)
      .compile();

    resolver = module.get<CryptoResolver>(CryptoResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
