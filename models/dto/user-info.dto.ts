import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO cho địa chỉ
export class AddressDto {
  @IsString({ message: 'Số điện thoại phải là một chuỗi.' })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống.' })
  phoneNumber: string;

  @IsString({ message: 'Tên người nhận phải là một chuỗi.' })
  @IsNotEmpty({ message: 'Tên người nhận không được để trống.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Địa chỉ chi tiết không được để trống.' })
  address: string;

  @IsObject()
  @IsOptional()
  province?: {
    code: string;
    name: string;
    type: string;
    typeName: string;
  };

  @IsObject()
  @IsOptional()
  district?: {
    code: string;
    name: string;
    type: string;
  };

  @IsObject()
  @IsOptional()
  ward?: {
    code: string;
    name: string;
    type: string;
  };

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean = false;
}

export class UpdateAddressDto {
  @IsArray({ message: 'Địa chỉ phải là một mảng các đối tượng.' })
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  address: AddressDto[];
}

// Định nghĩa DTO cho UserInformation
export class CreateUserInformationDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  idProfile: string; // Căn cước công dân

  @IsString()
  fullName: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  email: string;

  @IsString()
  birthday: string;

  @IsEnum(['male', 'female', 'other'])
  gender: string;

  @IsOptional()
  @IsString()
  bankBranch: string;

  @IsOptional()
  @IsString()
  bank: string;

  @IsArray()
  @IsOptional()
  address: AddressDto[];

  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsString()
  status: string;
}

// DTO cho UpdateUserInformationDto (cho phép cập nhật thông tin)
export class UpdateUserInformationDto {
  @IsOptional()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  idProfile: string; // Căn cước công dân

  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  birthday: string;

  @IsOptional()
  @IsEnum(['male', 'female', 'other'])
  gender: string;

  @IsOptional()
  @IsString()
  bankBranch: string;

  @IsOptional()
  @IsString()
  bank: string;

  @IsOptional()
  @IsArray()
  address: AddressDto[] = [];

  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsString()
  status: string;
}
