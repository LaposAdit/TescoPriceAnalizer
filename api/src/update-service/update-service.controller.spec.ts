import { Test, TestingModule } from '@nestjs/testing';
import { UpdateServiceController } from './update-service.controller';

describe('UpdateServiceController', () => {
  let controller: UpdateServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateServiceController],
    }).compile();

    controller = module.get<UpdateServiceController>(UpdateServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
