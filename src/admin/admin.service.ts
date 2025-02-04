import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateAdminDto,
  LoginAdminDto,
  UpdateAdminDto,
} from 'models/dto/admin.dto';
import { Admin, AdmniDocument } from 'models/schema/admin.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { PaginationSet } from 'models/response';
import { JwtService } from '@nestjs/jwt';
import { genStatusLabel } from 'src/utils/status.util';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<AdmniDocument>,
    private jwtService: JwtService,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const createAdmin = new this.adminModel(createAdminDto);
    return await createAdmin.save();
  }

  async modify(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    if (updateAdminDto.password) {
      const salt = await bcrypt.genSalt();
      updateAdminDto.password = await bcrypt.hash(
        updateAdminDto.password,
        salt,
      );
    }

    const updateAdmin = await this.adminModel
      .findByIdAndUpdate(id, updateAdminDto, { new: true })
      .exec();
    if (!updateAdmin) {
      throw new NotFoundException(`Không thấy admin có Id: ${id}`);
    }
    return updateAdmin;
  }

  async list(
    page: number,
    pageSize: number,
    search?: string,
    role?: string,
    status?: string,
  ): Promise<PaginationSet<Admin>> {
    const skip = (page - 1) * pageSize;

    const filter: any = {};

    if (search) {
      filter.username = { $regex: search, $options: 'i' };
    }
    if (role) {
      filter.role = role;
    }
    if (status) {
      filter.status = status;
    }

    const totalItems = await this.adminModel.countDocuments(filter);

    const response = await this.adminModel
      .find(filter)
      .skip(skip)
      .limit(pageSize)
      .exec();

    const data: Admin[] = response.map((admin) => {
      const adminJson = admin.toJSON();
      return {
        ...adminJson,
        statusLabel: genStatusLabel(adminJson.status),
      };
    });

    return new PaginationSet(data, page, pageSize, totalItems);
  }

  async detal(id: string): Promise<Admin> {
    const admin = await this.adminModel.findById(id).exec();

    if (!admin) {
      throw new NotFoundException(`Không tìm thấy bản ghi có Id: ${id}`);
    }

    return admin;
  }

  async remove(id: string): Promise<void> {
    const response = await this.adminModel.findByIdAndDelete(id).exec();

    if (!response) {
      throw new NotFoundException(`Admin with ID "${id}" not found`);
    }
  }

  async login(loginAdminDto: LoginAdminDto): Promise<{ accessToken: string }> {
    const { username, password } = loginAdminDto;

    const admin = await this.adminModel.findOne({ username }).exec();

    if (!admin) {
      throw new NotFoundException('Không tìm thấy tài khoản người dùng');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      throw new NotFoundException('Mật khẩu không đúng');
    }

    const payload = {
      username: admin.username,
      sub: admin._id,
      role: admin.role,
    };

    try {
      const token = this.jwtService.sign(payload);
      return { accessToken: token };
    } catch (error: unknown) {
      throw new Error('Lỗi không tạo được token: ' + (error as Error).message);
    }
  }
}
