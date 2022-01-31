import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {UserService} from '../user/user.service';
import {User} from '../user/entities/user.entity';
import {QueuedJob} from './entities/Job.entity';
import {QueueInventory} from './inventories/Queue-inventory';
import {SchedulerService} from './scheduler.service';
import {CryptoService} from '../crypto/crypto.service';
import {JobInventory} from './inventories/Job-inventory';

describe('SchedulerService', () => {
  let service: SchedulerService;
  const mockUserRepository = {};
  const mockJobInventory = {};
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
        JobInventory,
        {provide: getRepositoryToken(User), useValue: mockUserRepository},
      ],
    })
      .overrideProvider(QueueInventory)
      .useValue(mockQueueInventory)
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .overrideProvider(CryptoService)
      .useValue(mockCryptoService)
      .overrideProvider(JobInventory)
      .useValue(mockJobInventory)
      .compile();

    service = module.get<SchedulerService>(SchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
