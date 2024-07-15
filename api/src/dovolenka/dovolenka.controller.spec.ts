import { Test, TestingModule } from '@nestjs/testing';
import { DovolenkaController } from './dovolenka.controller';

describe('DovolenkaController', () => {
  let controller: DovolenkaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DovolenkaController],
    }).compile();

    controller = module.get<DovolenkaController>(DovolenkaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
