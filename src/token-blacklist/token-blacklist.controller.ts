import { Controller } from '@nestjs/common';
import { TokenBlacklistService } from './token-blacklist.service';

@Controller('token-blacklist')
export class TokenBlacklistController {
  constructor(private readonly tokenBlacklistService: TokenBlacklistService) {}
}
