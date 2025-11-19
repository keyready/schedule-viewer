import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Aud, AudDocument } from './schemas/aud.schema';

@Injectable()
export class AudsService {
  constructor(@InjectModel(Aud.name) private readonly audModel: Model<AudDocument>) {}

  async createMany(titles: string[]): Promise<string[]> {
    const created = await this.audModel.insertMany(titles.map((title) => ({ title })));
    return created.map((doc) => String(doc._id));
  }

  async deleteOne(audId: string): Promise<void> {
    await this.audModel.deleteOne({ _id: audId });
  }

  async findAll() {
    const auds = await this.audModel.find({}).lean();
    if (!auds?.length) throw new NotFoundException('Аудиторий не найдено');
    return auds;
  }
}


