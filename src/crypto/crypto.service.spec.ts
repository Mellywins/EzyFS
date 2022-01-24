import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {User} from '../user/entities/user.entity';
import {CryptoService} from './crypto.service';
import {KeyOwnershipHelper} from './helpers/key-ownership.helper';
import {PublicKeyManager} from './managers/public-key-manager';

describe('CryptoService', () => {
  let service: CryptoService;
  const mockPublicKeyManager = {};
  const mockKeyOwnershipHelper = {};
  const mockUserRepository = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoService,
        PublicKeyManager,
        KeyOwnershipHelper,
        {provide: getRepositoryToken(User), useValue: mockUserRepository},
      ],
    })
      .overrideProvider(PublicKeyManager)
      .useValue(mockPublicKeyManager)
      .overrideProvider(KeyOwnershipHelper)
      .useValue(mockKeyOwnershipHelper)
      .compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
