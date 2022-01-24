import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {User} from '../user/entities/user.entity';
import {QueuedJob} from './entities/Job.entity';
import {QueueInventory} from './inventories/Queue-inventory';
import {SchedulerService} from './scheduler.service';

describe('SchedulerService', () => {
  let service: SchedulerService;
  const mockUserRepository = {};
  const mockQueuedJobRepository = {};
  const mockQueueInventory = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulerService,
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
      .compile();

    service = module.get<SchedulerService>(SchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
