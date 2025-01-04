import { Controller } from '@nestjs/common';
import { UserInformationService } from './user-information.service';

@Controller('user-information')
export class UserInformationController {
  constructor(
    private readonly userInformationService: UserInformationService,
  ) {}
}
