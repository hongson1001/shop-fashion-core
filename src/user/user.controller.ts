import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Request,
  Put,
  Param,
  Headers,
  BadGatewayException,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ChangePassworDto,
  ConfirmDeleteAccountDto,
  DeleteAccountDto,
  ForgotPasswordDto,
  LoginUserDto,
  RegisterDto,
  ResetPasswordDto,
  SetPasswordDto,
  VerifyOtpDto,
} from 'models/dto/user.dto';
import {
  ErrorResponseModel,
  PaginationSet,
  ResponseContentModel,
} from 'models/response';
import { User } from 'models/schema/user.schema';
import { UserAuthGuard } from 'src/middleware/user.middleware';
import { AdminAuthGuard } from 'src/middleware/admin.middleware';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  //#region Đăng ký tài khoản
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const response = await this.userService.registerUser(registerDto);

      return new ResponseContentModel<any>(
        201,
        'Đăng ký mail thành công',
        response,
      );
    } catch (error) {
      return new ErrorResponseModel(500, 'Có lỗi trong quá trình xử lý', [
        [(error as Error).message || 'Unknown error occurred'],
      ]);
    }
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    try {
      const response = await this.userService.verifyOtp(verifyOtpDto);

      return new ResponseContentModel<any>(
        201,
        'Xác mình mã OTP thành công',
        response,
      );
    } catch (error) {
      return new ErrorResponseModel(500, 'Có lỗi trong quá trình xử lý', [
        [(error as Error).message || 'Unknown error occurred'],
      ]);
    }
  }

  @Post('register-password')
  async setPassword(@Body() passworđto: SetPasswordDto) {
    try {
      const response = await this.userService.setPassword(passworđto);

      return new ResponseContentModel<any>(
        201,
        'Thiết lập mật khẩu thành công',
        response,
      );
    } catch (error) {
      return new ErrorResponseModel(500, 'Có lỗi trong quá trình xử lý', [
        [(error as Error).message || 'Unknown error occurred'],
      ]);
    }
  }
  //#endregion

  //#region Đăng nhập và đăng xuất
  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    try {
      const response = await this.userService.loginUser(loginUserDto);

      return new ResponseContentModel<any>(
        200,
        'Đăng nhập thành công',
        response,
      );
    } catch (error) {
      return new ErrorResponseModel(500, 'Có lỗi trong quá trình xử lý', [
        [(error as Error).message || 'Unknown error occurred'],
      ]);
    }
  }

  @Post('logout')
  @UseGuards(UserAuthGuard)
  async logoutUser(@Headers('Authorization') authorization: string) {
    try {
      const token = authorization?.replace('Bearer ', '');
      if (!token) {
        throw new BadGatewayException('Token không hợp lệ');
      }

      const response = await this.userService.logoutUser(token);

      return new ResponseContentModel<any>(
        200,
        'Đăng xuất thành công',
        response,
      );
    } catch (error) {
      return new ErrorResponseModel(500, 'Có lỗi trong quá trình xử lý', [
        [(error as Error).message || 'Unknown error occurred'],
      ]);
    }
  }
  //#endregion

  //#region Đổi mật khẩu và quên mật khẩu
  @Put('change-password')
  @UseGuards(UserAuthGuard)
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePassworDto,
  ) {
    try {
      const userId = req.user.sub;
      const response = await this.userService.changePassword(
        userId,
        changePasswordDto,
      );

      return new ResponseContentModel<any>(
        200,
        'Đổi mật khẩu thành công',
        response,
      );
    } catch (error) {
      return new ErrorResponseModel(500, 'Có lỗi trong quá trình xử lý', [
        [(error as Error).message || 'Unknown error occurred'],
      ]);
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      const response = await this.userService.forgotPassword(forgotPasswordDto);
      return new ResponseContentModel<any>(200, 'Mã OTP đã được gửi', response);
    } catch (error) {
      return new ErrorResponseModel(500, 'Có lỗi trong quá trình xử lý', [
        [(error as Error).message || 'Unknown error occurred'],
      ]);
    }
  }
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      const response = await this.userService.resetPassword(resetPasswordDto);
      return new ResponseContentModel<any>(
        200,
        'Mật khẩu đã được thay đổi',
        response,
      );
    } catch (error) {
      return new ErrorResponseModel(500, 'Có lỗi trong quá trình xử lý', [
        [(error as Error).message || 'Unknown error occurred'],
      ]);
    }
  }
  //#endregion

  //#region Khoá và mở tài khoản
  //Khoá hoặc mở tài khoản
  @Post('change-account-status')
  @UseGuards(AdminAuthGuard)
  async changeAccountUser(
    @Body('userId') userId: string,
    @Body('action') action: 'active' | 'blocked',
  ) {
    try {
      const response = await this.userService.changeAccountUser(userId, action);

      return new ResponseContentModel<any>(
        200,
        'Tài đã được thay đổi',
        response,
      );
    } catch (error) {
      return new ErrorResponseModel(500, 'Có lỗi trong quá trình xử lý', [
        [(error as Error).message || 'Unknown error occurred'],
      ]);
    }
  }

  //Xoá tài khoản
  @Post('delete-account')
  @UseGuards(UserAuthGuard)
  async requestDeleteAccount(
    @Body() deleteAccountRequestDto: DeleteAccountDto,
  ) {
    try {
      const response = await this.userService.deleteAccount(
        deleteAccountRequestDto,
      );
      return new ResponseContentModel(
        200,
        'Yêu cầu xóa tài khoản thành công',
        response,
      );
    } catch (error) {
      return new ErrorResponseModel(500, 'Có lỗi xảy ra', [
        [(error as Error).message || 'Unknown error occurred'],
      ]);
    }
  }

  @Post('confirm-delete-account')
  @UseGuards(UserAuthGuard)
  async confirmDeleteAccount(
    @Body() confirmDeleteAccountDto: ConfirmDeleteAccountDto,
  ) {
    try {
      const response = await this.userService.confirmDeleteAccount(
        confirmDeleteAccountDto,
      );
      return new ResponseContentModel(200, 'Tài khoản đã được xóa', response);
    } catch (error) {
      return new ErrorResponseModel(500, 'Có lỗi xảy ra', [
        [(error as Error).message || 'Unknown error occurred'],
      ]);
    }
  }
  //#endregion

  //#region  CRUD User
  @Get()
  @UseGuards(AdminAuthGuard)
  async list(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('role') role?: string,
  ) {
    try {
      const response = await this.userService.list(
        page,
        pageSize,
        search,
        role,
        status,
      );

      return new ResponseContentModel<PaginationSet<User>>(
        200,
        'Lấy danh sách thành công',
        response,
      );
    } catch (error) {
      return new ErrorResponseModel(500, 'Có lỗi xảy ra', [
        [(error as Error).message || 'Unknown error occurred'],
      ]);
    }
  }

  @Get(':code')
  @UseGuards(UserAuthGuard)
  async detail(@Param('code') code: string) {
    try {
      const response = await this.userService.detail(code);

      return new ResponseContentModel<any>(
        200,
        'Lấy chi tiết tài khoản thành công',
        response,
      );
    } catch (error) {
      return new ErrorResponseModel(500, 'Có lỗi xảy ra', [
        [(error as Error).message || 'Unknown error occurred'],
      ]);
    }
  }
  //#endregion
}
