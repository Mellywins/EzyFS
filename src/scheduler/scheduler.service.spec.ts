import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {UserService} from '../user/user.service';
import {User} from '../user/entities/user.entity';
import {QueuedJob} from './entities/Job.entity';
import {QueueInventory} from './inventories/Queue-inventory';
import {SchedulerService} from './scheduler.service';
import {CryptoService} from '../crypto/crypto.service';

describe('SchedulerService', () => {
  let service: SchedulerService;
  const mockUserRepository = {};
  const mockQueuedJobRepository = {};
  const mockQueueInventory = {};
  const mockUserService = {};
  const mockCryptoService = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        SchedulerService,
        CryptoService,
        QueueInventory,
        {
          provide: getRepositoryToken(QueuedJob),
          useValue: mockQueuedJobRepository,
        },
        {provide: getRepositoryToken(User), useValue: mockUserRepository},
      ],
    })
      .overrideProvider(QueueInventory)
      .useValue(mockQueueInventory)
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .overrideProvider(CryptoService)
      .useValue(mockCryptoService)
      .compile();

    service = module.get<SchedulerService>(SchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
