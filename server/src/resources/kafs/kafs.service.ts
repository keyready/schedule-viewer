import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AudsService } from '../auds/auds.service';
import { Model, Types } from 'mongoose';
import { Kaf, KafDocument } from './schemas/kaf.schema';

@Injectable()
export class KafsService {
  constructor(
    @InjectModel(Kaf.name) private readonly kafModel: Model<KafDocument>,
    private readonly audsService: AudsService,
  ) {}

  async create(title: string) {
    return this.kafModel.create({ title });
  }

  async addAudsToKaf(parentKafId: string, audsTitles: string[]) {
    const audsIds = await this.audsService.createMany(audsTitles);
    await this.kafModel.updateOne({ _id: parentKafId }, { audsIds: audsIds.map((id) => new Types.ObjectId(id)) });
  }

  async deleteKafAndAuds(kafId: string) {
    const wantedKaf = await this.kafModel.findOne({ _id: kafId });
    if (!wantedKaf) throw new NotFoundException('Кафедра не найдена');

    const wantedAuds = wantedKaf.audsIds || [];
    if (wantedAuds.length) {
      // удаляем ауды пакетно
      await this.kafModel.db.collection('auds').deleteMany({ _id: { $in: wantedAuds } });
    }
    await this.kafModel.deleteOne({ _id: kafId });
  }

  async deleteAud(audId: string) {
    await this.audsService.deleteOne(audId);
  }

  async findByIdWithAuds(kafId: string) {
    const wantedKaf = await this.kafModel.findOne({ _id: kafId }).populate({ path: 'audsIds' });
    if (!wantedKaf) throw new NotFoundException(`Кафедра с ID = ${kafId} не найдена`);
    const auds = (wantedKaf as any).audsIds as any[];
    if (!auds?.length) throw new NotFoundException(`За кафедрой с ID = ${kafId} аудитории не закреплены`);
    return auds;
  }

  async getKafs(populate: boolean) {
    const kafs = populate
      ? await this.kafModel.find({}).populate({ path: 'audsIds' })
      : await this.kafModel.find({});
    if (!kafs.length) throw new NotFoundException('Кафедры не найдены');
    return kafs;
  }
}


