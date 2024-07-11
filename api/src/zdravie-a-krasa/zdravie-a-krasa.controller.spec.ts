import { Test, TestingModule } from '@nestjs/testing';
import { ZdravieAKrasaController } from './zdravie-a-krasa.controller';

describe('ZdravieAKrasaController', () => {
  let controller: ZdravieAKrasaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZdravieAKrasaController],
    }).compile();

    controller = module.get<ZdravieAKrasaController>(ZdravieAKrasaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
