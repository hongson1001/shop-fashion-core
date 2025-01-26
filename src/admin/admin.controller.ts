import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminAuthGuard } from 'src/middleware/admin.middleware';
import {
  CreateAdminDto,
  LoginAdminDto,
  UpdateAdminDto,
} from 'models/dto/admin.dto';
import {
  PaginationSet,
  ResponseContentModel,
  ErrorResponseModel,
} from 'models/response';
import { Admin } from 'models/schema/admin.schema';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async create(@Body() createAdminDto: CreateAdminDto) {
    try {
      const admin = await this.adminService.create(createAdminDto);

      return new ResponseContentModel<Admin>(
        201,
        'Tạo tài khoản admin thành công',
        admin,
      );
    } catch (error) {
      return new ErrorResponseModel(500, 'Có lỗi trong quá trình xử lý', [
        [(error as Error).message || 'Unknown error occurred'],
      ]);
    }
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  async modify(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    try {
      const admin = await this.adminService.modify(id, updateAdminDto);
      return new ResponseContentModel<Admin>(
        200,
        'Cập nhật admin tài khoản admin thành công',
        admin,
      );
    } catch (error) {
      return new ErrorResponseModel(500, 'Có lỗi trong quá trình xử lý', [
        [(error as Error).message || 'Unknown error occurred'],
      ]);
    }
  }

  @Get()
  @UseGuards(AdminAuthGuard)
  async list(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('search') search: string,
    @Query('role') role: string,
    @Query('status') status: string,
  ) {
    try {
      const response = await this.adminService.list(
        page,
        pageSize,
        search,
        role,
        status,
      );

      return new ResponseContentModel<PaginationSet<Admin>>(
        200,
        'Lấy danh sách thành công',
        response,
      );
    } catch (error) {
      return new ErrorResponseModel(500, 'Có lỗi trong quá trình xử lý', [
        [(error as Error).message || 'Unknown error occurred'],
      ]);
    }
  }

  @Get(':id')
  @UseGuards(AdminAuthGuard)
  async detail(@Param('id') id: string) {
    try {
      const admin = await this.adminService.detal(id);

      return new ResponseContentModel<Admin>(
        200,
        'Lấy chi tiết admin thành công',
        admin,
      );
    } catch (error) {
      return new ErrorResponseModel(500, 'Có lỗi trong quá trình xử lý', [
        [(error as Error).message || 'Unknown error occurred'],
      ]);
    }
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  async remove(@Param('id') id: string) {
    try {
      await this.adminService.remove(id);

      return new ResponseContentModel<string>(
        200,
        'Xoá tài khoản thafnhc công',
        null,
      );
    } catch (error) {
      return new ErrorResponseModel(500, 'Có lỗi trong quá trình xử lý', [
        [(error as Error).message || 'Unknown error occurred'],
      ]);
    }
  }

  @Post('login')
  async login(@Body() loginAdminDto: LoginAdminDto) {
    try {
      const token = await this.adminService.login(loginAdminDto);

      return new ResponseContentModel<{ accessToken: string }>(
        200,
        'Đăng nhập thành công',
        token,
      );
    } catch (error) {
      return new ErrorResponseModel(500, 'Có lỗi trong quá trình xử lý', [
        [(error as Error).message || 'Unknown error occurred'],
      ]);
    }
  }
}
