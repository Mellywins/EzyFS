/* eslint-disable import/no-extraneous-dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {RedisCacheService} from './redis-cache.service';

describe('RedisCacheService', () => {
  let service: RedisCacheService;
  const mockRedisCacheService = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisCacheService],
    })
      .overrideProvider(RedisCacheService)
      .useValue(mockRedisCacheService)
      .compile();

    service = module.get<RedisCacheService>(RedisCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
