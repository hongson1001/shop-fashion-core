import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AddressDto,
  UpdateAddressDto,
  UpdateUserInformationDto,
} from 'models/dto/user-info.dto';
import { PaginationSet } from 'models/response';
import { User, UserDocument } from 'models/schema/user.schema';
import {
  UserInformation,
  UserInformationDocument,
} from 'models/schema/userInformation.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserInformationService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(UserInformation.name)
    private readonly uiModel: Model<UserInformationDocument>,
  ) {}

  //#region UserInfomation
  async updateUserInformation(
    userId: string,
    updateUserInformationDto: UpdateAddressDto,
  ): Promise<UpdateUserInformationDto> {
    const checkUser = await this.userModel.findOne({ _id: userId });
    if (!checkUser) {
      throw new NotFoundException('Không thấy tài khoản');
    }

    const userInformation = await this.uiModel.findOneAndUpdate(
      { userId },
      { $set: updateUserInformationDto },
      { new: true },
    );
    if (!userInformation) {
      throw new NotFoundException(` Không tìm thấy thông tin người dùng `);
    }

    return userInformation;
  }

  async getUserInfoByUser(userId: string): Promise<UserInformation> {
    const userInfo = await this.uiModel.findOne({ userId }).exec();
    if (!userInfo) {
      throw new NotFoundException('Không thấy tài khoản');
    }

    return userInfo;
  }
  //#endregion

  //#region Address
  async addAddress(userId: string, addressDto: AddressDto): Promise<any> {
    const userInfo = await this.uiModel.findOne({ userId });
    if (!userInfo) {
      throw new NotFoundException('Không tìm thấy thông tin người dùng');
    }

    if (addressDto.isDefault) {
      await this.uiModel.updateOne(
        { userId, 'address.isDefault': true },
        { $set: { 'address.$[].isDefault': false } },
      );
    }

    const updatedUserInfo = await this.uiModel.findOneAndUpdate(
      { userId },
      { $push: { address: addressDto } },
      { new: true },
    );

    return updatedUserInfo;
  }

  async listAddress(
    userId: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginationSet<any>> {
    const userInfo = await this.uiModel.findOne({ userId });
    if (!userInfo) {
      throw new NotFoundException('Không tìm thấy thông tin người dùng');
    }

    const skip = (page - 1) * pageSize;
    const totalItems = userInfo.address.length;

    const addresses = userInfo.address.slice(skip, skip + pageSize);

    return new PaginationSet(addresses, totalItems, page, pageSize);
  }
  //#endregion
}
