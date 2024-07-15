import { Test, TestingModule } from '@nestjs/testing';
import { DovolenkaService } from './dovolenka.service';

describe('DovolenkaService', () => {
  let service: DovolenkaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DovolenkaService],
    }).compile();

    service = module.get<DovolenkaService>(DovolenkaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
