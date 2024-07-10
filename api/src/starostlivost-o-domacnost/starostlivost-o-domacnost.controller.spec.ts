import { Test, TestingModule } from '@nestjs/testing';
import { StarostlivostODomacnostController } from './starostlivost-o-domacnost.controller';

describe('StarostlivostODomacnostController', () => {
  let controller: StarostlivostODomacnostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StarostlivostODomacnostController],
    }).compile();

    controller = module.get<StarostlivostODomacnostController>(StarostlivostODomacnostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
