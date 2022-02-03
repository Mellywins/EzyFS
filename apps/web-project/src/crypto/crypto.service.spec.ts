import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {UserService} from '../user/user.service';
import {User} from '../user/entities/user.entity';
import {CryptoService} from './crypto.service';
import {AsymKey} from './entities/AsymKey.entity';
import {KeyOwnershipHelper} from './helpers/key-ownership.helper';
import {PublicKeyManager} from './managers/public-key-manager';

describe('CryptoService', () => {
  let service: CryptoService;
  const mockPublicKeyManager = {};
  const mockKeyOwnershipHelper = {};
  const mockUserRepository = {};
  const mockKeyRepository = {};
  const mockUserService = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoService,
        PublicKeyManager,
        KeyOwnershipHelper,
        {provide: getRepositoryToken(User), useValue: mockUserRepository},
        {provide: getRepositoryToken(AsymKey), useValue: mockKeyRepository},
        UserService,
      ],
    })
      .overrideProvider(PublicKeyManager)
      .useValue(mockPublicKeyManager)
      .overrideProvider(KeyOwnershipHelper)
      .useValue(mockKeyOwnershipHelper)
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
