import { Test, TestingModule } from '@nestjs/testing';
import { TokenBlacklistController } from './token-blacklist.controller';
import { TokenBlacklistService } from './token-blacklist.service';

describe('TokenBlacklistController', () => {
  let controller: TokenBlacklistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenBlacklistController],
      providers: [TokenBlacklistService],
    }).compile();

    controller = module.get<TokenBlacklistController>(TokenBlacklistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
