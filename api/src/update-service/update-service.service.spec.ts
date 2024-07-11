import { Test, TestingModule } from '@nestjs/testing';
import { UpdateServiceService } from './update-service.service';

describe('UpdateServiceService', () => {
  let service: UpdateServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdateServiceService],
    }).compile();

    service = module.get<UpdateServiceService>(UpdateServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
