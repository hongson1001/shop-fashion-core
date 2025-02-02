import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserInformationService } from './user-information.service';
import { AddressDto, UpdateAddressDto } from 'models/dto/user-info.dto';
import {
  ErrorResponseModel,
  PaginationSet,
  ResponseContentModel,
} from 'models/response';
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

  @Post('update/address')
  @UseGuards(UserAuthGuard)
  async addAddress(@Request() req: any, @Body() addressDto: AddressDto) {
    try {
      const userId = req.user.sub;

      const response = await this.userInformationService.addAddress(
        userId,
        addressDto,
      );

      return new ResponseContentModel<any>(201, 'Thành công', response);
    } catch (error) {
      return new ErrorResponseModel(500, 'Có lỗi trong quá trình xử lý', [
        [(error as Error).message || 'Unknown error occurred'],
      ]);
    }
  }

  @Get('user-information/address')
  @UseGuards(UserAuthGuard)
  async listAddress(
    @Request() req: any,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    try {
      const userId = req.user.sub;

      const response = await this.userInformationService.listAddress(
        userId,
        page,
        pageSize,
      );

      return new ResponseContentModel<PaginationSet<any>>(
        200,
        'Thành công',
        response,
      );
    } catch (error) {
      return new ErrorResponseModel(500, 'Có lỗi trong quá trình xử lý', [
        [(error as Error).message || 'Unknown error occurred'],
      ]);
    }
  }
}
