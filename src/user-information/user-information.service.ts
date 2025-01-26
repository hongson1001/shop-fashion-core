import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateAddressDto } from 'models/dto/user-info.dto';
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
  ): Promise<any> {
    const checkUser = await this.userModel.findOne({ _id: { $in: userId } });
    if (!checkUser) {
      throw new NotFoundException('Không thấy tài khoản');
    }

    const userInformation = await this.uiModel.findOne({
      userId,
    });
    if (!userInformation) {
      throw new NotFoundException('Không thấy tài khoản');
    }

    Object.assign(userInformation, updateUserInformationDto);

    return userInformation.save();
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
  //#endregion
}
