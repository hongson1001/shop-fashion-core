import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { UserInformationService } from './user-information.service';
import { UpdateAddressDto } from 'models/dto/user-info.dto';
import { ErrorResponseModel, ResponseContentModel } from 'models/response';
import { UserAuthGuard } from 'src/middleware/user.middleware';
import { UserInformation } from 'models/schema/userInformation.schema';

@Controller('user-information')
export class UserInformationController {
  constructor(
    private readonly userInformationService: UserInformationService,
  ) {}

  @Put()
  @UseGuards(UserAuthGuard)
  async updateUserInformation(
    @Request() req: any,
    @Body() updateUserInformationDto: UpdateAddressDto,
  ) {
    try {
      const userId = req.user.sub;

      const response = await this.userInformationService.updateUserInformation(
        userId,
        updateUserInformationDto,
      );

      return new ResponseContentModel<any>(
        200,
        'Cập nhập thông tin thành công',
        response,
      );
    } catch (error) {
      return new ErrorResponseModel(500, 'Có lỗi trong quá trình xử lý', [
        [(error as Error).message || 'Unknown error occurred'],
      ]);
    }
  }

  @Get('user')
  @UseGuards(UserAuthGuard)
  async getUserInfoByUser(@Request() req: any) {
    try {
      const userId = req.user.sub;

      const userInfo =
        await this.userInformationService.getUserInfoByUser(userId);

      return new ResponseContentModel<UserInformation>(
        200,
        'Lấy thông tin thành công',
        userInfo,
      );
    } catch (error) {
      return new ErrorResponseModel(500, 'Có lỗi trong quá trình xử lý', [
        [(error as Error).message || 'Unknown error occurred'],
      ]);
    }
  }
}
