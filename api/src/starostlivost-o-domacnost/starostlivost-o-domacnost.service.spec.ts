import { Test, TestingModule } from '@nestjs/testing';
import { StarostlivostODomacnostService } from './starostlivost-o-domacnost.service';

describe('StarostlivostODomacnostService', () => {
  let service: StarostlivostODomacnostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StarostlivostODomacnostService],
    }).compile();

    service = module.get<StarostlivostODomacnostService>(StarostlivostODomacnostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
