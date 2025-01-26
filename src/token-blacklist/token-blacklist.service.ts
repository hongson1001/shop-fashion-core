import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  TokenBlacklist,
  TokenBlacklistDocument,
} from 'models/schema/tokenblacklist';
import { Model } from 'mongoose';

@Injectable()
export class TokenBlacklistService {
  constructor(
    @InjectModel(TokenBlacklist.name)
    private readonly tokenModel: Model<TokenBlacklistDocument>,
  ) {}

  async addTokenToBlacklist(token: string, expiresIn: number): Promise<void> {
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    await new this.tokenModel({ token, expiresAt }).save();
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const tokenDocs = await this.tokenModel.findOne({ token }).exec();
    return !!tokenDocs;
  }
}
