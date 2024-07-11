import { Test, TestingModule } from '@nestjs/testing';
import { ZdravieAKrasaService } from './zdravie-a-krasa.service';

describe('ZdravieAKrasaService', () => {
  let service: ZdravieAKrasaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZdravieAKrasaService],
    }).compile();

    service = module.get<ZdravieAKrasaService>(ZdravieAKrasaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
