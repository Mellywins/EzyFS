import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseConfigServiceService } from './database-config-service.service';

describe('DatabaseConfigServiceService', () => {
  let service: DatabaseConfigServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseConfigServiceService],
    }).compile();

    service = module.get<DatabaseConfigServiceService>(DatabaseConfigServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
