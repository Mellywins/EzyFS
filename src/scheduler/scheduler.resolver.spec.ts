import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerResolver } from './scheduler.resolver';
import { SchedulerService } from './scheduler.service';

describe('SchedulerResolver', () => {
  let resolver: SchedulerResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchedulerResolver, SchedulerService],
    }).compile();

    resolver = module.get<SchedulerResolver>(SchedulerResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
