import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'models/schema/user.schema';
import {
  UserInformation,
  UserInformationDocument,
} from 'models/schema/userInformation.schema';
import { Model } from 'mongoose';
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
import { PaginationSet } from 'models/response';
import { genStatusLabel } from 'src/utils/status.util';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Admin, AdmniDocument } from 'models/schema/admin.schema';
import { TokenBlacklistService } from 'src/token-blacklist/token-blacklist.service';
import { MailerCustomerService } from 'src/mailer/mailer.service';
import * as crypto from 'crypto';
import { sendLogsTelegram } from 'src/utils/send-logs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(UserInformation.name)
    private readonly uiModel: Model<UserInformationDocument>,
    @InjectModel(Admin.name)
    private readonly adminModel: Model<AdmniDocument>,

    private readonly jwtService: JwtService,
    private readonly tokenBlacklistService: TokenBlacklistService,
    private readonly mailerService: MailerCustomerService,
  ) {}

  //#region Đăng ký tài khoản
  async registerUser(registerDto: RegisterDto): Promise<any> {
    const { email } = registerDto;

    const user = await this.userModel.findOne({ email }).exec();
    if (user) {
      throw new BadRequestException(` Email: ${email} đã được đăng ký `);
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 50 * 1000);

    if (!user) {
      const newUser = new this.userModel({
        email,
        otp,
        otpExpiresAt,
        isVerified: false,
      });
      await newUser.save();
    } else {
      user.otp = otp;
      user.otpExpiresAt = otpExpiresAt;
      await user.save();
    }

    await this.mailerService.sendMail({
      to: email,
      subject: 'Xác mình tài khoản của bạn',
      text: ` Đây là mã OTP của bạn: ${otp}. Mã OTP sẽ hết hạn sau 5 phút. Vui lòng không cung cấp mã này cho bất kỳ ai `,
    });

    const message = `Đây là mã OTP của bạn: ${otp}. Mã OTP sẽ hết hạn sau 5 phút. Vui lòng không cung cấp mã này cho bất kỳ ai`;
    await sendLogsTelegram(message);

    return ` Mã OTP đã được gửi tới email: ${email} của bạn `;
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<any> {
    const { email, otp } = verifyOtpDto;

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new BadRequestException('Email không tồn tại');
    }

    if (user.otp !== otp) {
      throw new BadRequestException(` Mã OTP: ${otp} không chính xác `);
    }

    if (new Date() > user.otpExpiresAt) {
      throw new BadRequestException('OTP của bạn đã hết hạn');
    }

    user.otp = undefined;
    user.otpExpiresAt = undefined;
    user.isVerified = true;
    await user.save();

    return 'Xác mình mã OTP thành công';
  }

  async setPassword(passworđto: SetPasswordDto): Promise<any> {
    const { email, password } = passworđto;

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(` KHông tìm thấy email: ${email} `);
    }

    if (user.otp || user.otpExpiresAt) {
      throw new BadRequestException('Vui lòng xác minh OTP trước');
    }

    user.password = password;
    await user.save();

    await this.mailerService.sendMail({
      to: email,
      subject: 'Tạo tài khoản thành công',
      html: ` 
      <p>Bạn đã tạo tài khoản thành công với:</p>
      <p>Tài khoản: ${email}</p>
      <p>Mật khẩu: ${password}</p>
      <p>Vui lòng không cung cấp tài khoản với bất kỳ ai</p>
      <p>Shop Fashion, trân trọng</p>
      `,
    });

    return 'Tài khoản đã được tạo thành công';
  }
  //#endregion

  //#region Đăng nhập và dăng xuất
  async loginUser(loginUserDto: LoginUserDto): Promise<any> {
    const { email, password, isResmember } = loginUserDto;

    const user = await this.userModel
      .findOne({ email, status: 'active' })
      .exec();
    if (!user) {
      throw new NotFoundException(`Email: ${email} không tồn tại`);
    }

    const isPasswordValid = await bcrypt.compare(
      password + user.passCode,
      user.password,
    );
    if (!isPasswordValid) {
      throw new ForbiddenException('Mật khẩu không chính xác');
    }

    const payload = {
      email: user.email,
      sub: user._id,
      role: user.role,
      shop: user.shopId,
    };
    const tokenExpiry = isResmember ? '30d' : '1h';

    try {
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: tokenExpiry,
      });
      return { accessToken: token };
    } catch (error: unknown) {
      throw new Error('Lỗi không tạo được token' + (error as Error).message);
    }
  }

  async logoutUser(token: string): Promise<any> {
    try {
      const decodedToken = this.jwtService.decode(token) as { exp: number };
      if (!decodedToken || !decodedToken.exp) {
        throw new Error('Token không hợp lệ');
      }

      const expiresIn = decodedToken.exp - Math.floor(Date.now() / 1000);

      await this.tokenBlacklistService.addTokenToBlacklist(token, expiresIn);

      return 'Đăng xuất thành công';
    } catch (error) {
      throw new Error('Không thể đăng xuất: ' + (error as Error).message);
    }
  }
  //#endregion

  //#region đổi mật khẩu và quên mật khẩu
  //Đổi mật khẩu
  async changePassword(
    userId: string,
    changePassworDto: ChangePassworDto,
  ): Promise<any> {
    const { oldPassword, newPassword } = changePassworDto;

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const isPasswordValid = await bcrypt.compare(
      oldPassword + user.passCode,
      user.password,
    );
    if (!isPasswordValid) {
      throw new ForbiddenException('Mật khẩu cũ không chính xác');
    }

    const hashedPassword = await bcrypt.hash(newPassword + user.passCode, 10);
    user.password = hashedPassword;

    await user.save();

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Đôi mật khẩu thành công',
      text: ` Bạn đã đổi mật khẩu thành công. Nếu bạn không phải là người thực hiện hành động này vui longf liên hệ chúng tôi để được giúp đõ `,
    });

    return 'Đổi mật khẩu thành công';
  }

  //Quên mật khẩu
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    const { email } = forgotPasswordDto;

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`Email: ${email} không tồn tại`);
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    await this.mailerService.sendMail({
      to: email,
      subject: 'Mã OTP để đặt lại mật khẩu',
      text: `Mã OTP của bạn là: ${otp}. Mã OTP sẽ hết hạn sau 5 phút.`,
    });

    const message = `Mã OTP của bạn là: ${otp}. Mã OTP sẽ hết hạn sau 5 phút.`;
    await sendLogsTelegram(message);

    return 'Mã OTP đã được gửi vào email của bạn';
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any> {
    const { otp, newPassword } = resetPasswordDto;

    const user = await this.userModel.findOne({ otp }).exec();
    if (!user) {
      throw new BadRequestException('Mã OTP không hợp lệ');
    }

    if (new Date() > user.otpExpiresAt) {
      throw new BadRequestException('Mã OTP đã hết hạn');
    }

    if (!user.passCode) {
      throw new BadRequestException('Không tìm thấy passCode của người dùng');
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword + user.passCode, salt);

    user.password = hashedPassword;

    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Mật khẩu đã được thay đổi',
      html: `
        <p>Bạn đã đổi mật khẩu mới thành công</p>
        <p>Vui lòng không cung cấp mật khẩu mới này cho người khác. Nếu không phải bạn thay đổi mật khẩu vui lòng liện hệ chúng toi để được trợ giúp</p>
      `,
    });

    return 'Mật khẩu đã được thay đổi thành công';
  }

  //#endregion

  //#region Khoá mở tài khoản và xoá tài khoản
  //Khoá hoặc mở tài khoản
  async changeAccountUser(
    userId: string,
    action: 'active' | 'blocked',
  ): Promise<any> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('KHông tìm thấy người dùng');
    }

    user.status = action;
    await user.save();

    return ` Tài khoản đã được ${action === 'active' ? 'mở' : 'khoá'} thành công `;
  }

  //Xoá tài khoản
  async deleteAccount(deleteAccountDto: DeleteAccountDto): Promise<string> {
    const { email } = deleteAccountDto;

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(` Emai: ${email} không tồn tại `);
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    await this.mailerService.sendMail({
      to: email,
      subject: 'Xác minh tài khoản',
      text: ` Mã OTP của bạn là: ${otp}. Mã OTP sẽ hết hạn sau 5p. Vui òng không cung cấp mã này cho bất kỳ ai `,
    });

    const message = `Mã OTP của bạn là: ${otp}. Mã OTP sẽ hết hạn sau 5p. Vui òng không cung cấp mã này cho bất kỳ ai`;
    await sendLogsTelegram(message);

    return 'Mã OTP đã được gửi tới email của bạn';
  }

  async confirmDeleteAccount(
    confirmDeleteAccountDto: ConfirmDeleteAccountDto,
  ): Promise<string> {
    const { email, otp } = confirmDeleteAccountDto;

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(` Emai: ${email} không tồn tại `);
    }

    if (user.otp !== otp) {
      throw new BadRequestException('Mã OTP không hợp lệ');
    }
    if (new Date() > user.otpExpiresAt) {
      throw new BadRequestException('Mã OTP đã hết hạn');
    }

    await user.deleteOne({ email }).exec();

    await this.mailerService.sendMail({
      to: email,
      subject: 'Tài khoản đã bị xóa',
      text: 'Tài khoản của bạn đã được xóa thành công. Nếu đây không phải là bạn, vui lòng liên hệ với chúng tôi ngay lập tức.',
    });

    const message = `Tài khoản ${email} của bạn đã xóa thành công.`;
    await sendLogsTelegram(message);

    return 'Tài khoản của bạn đã được xóa thành công.';
  }
  //#endregion

  //#region CRUD User
  async list(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    status?: string,
    role?: string,
  ): Promise<PaginationSet<User>> {
    const skip = (page - 1) * pageSize;
    const filter: Record<string, any> = {};

    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) {
      filter.status = status;
    }
    if (role) {
      filter.role = role;
    }

    const [data, totalItems] = await Promise.all([
      this.userModel.find(filter).skip(skip).limit(pageSize).exec(),
      this.userModel.countDocuments(filter).exec(),
    ]);

    const dataWithStatus = data.map((u) => ({
      ...u.toObject(),
      statusLabel: genStatusLabel(u.status),
    }));

    return new PaginationSet(dataWithStatus, totalItems, page, pageSize);
  }

  async detail(code: string): Promise<any> {
    const user = await this.userModel
      .findOne({ code })
      .select('-refreshToken -isVerified -password -passCode')
      .exec();
    if (!user) {
      throw new NotFoundException('Không tìm tháy tài khoản');
    }

    const userInfomation = await this.uiModel
      .findOne({ userId: user._id })
      .exec();

    const statusLabel = genStatusLabel(user.status);

    return {
      user: {
        ...user.toObject(),
        statusLabel,
      },
      userInfomation: userInfomation || null,
    };
  }
  //#endregion
}
