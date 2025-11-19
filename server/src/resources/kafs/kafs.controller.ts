import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { KafsService } from './kafs.service';

@Controller('api')
export class KafsController {
  constructor(private readonly kafsService: KafsService) {}

  // POST /api/delete  { audId? , kafId? }
  @Post('delete')
  async delete(@Body('audId') audId?: string, @Body('kafId') kafId?: string) {
    if (audId) {
      await this.kafsService.deleteAud(audId);
      return { message: 'Аудитория удалена' };
    }
    if (kafId) {
      await this.kafsService.deleteKafAndAuds(kafId);
      return { ok: true, message: 'Кафедра удалена' };
    }
    return { ok: false, message: 'Не передан audId или kafId' };
  }

  // POST /api/create_kaf { title }
  @Post('create_kaf')
  async createKaf(@Body('title') title: string) {
    await this.kafsService.create(title);
    return { ok: true };
  }

  // POST /api/add_auds_to_kaf { audsTitles: string[], parentKafId: string }
  @Post('add_auds_to_kaf')
  async addAuds(
    @Body('audsTitles') audsTitles: string[],
    @Body('parentKafId') parentKafId: string,
  ) {
    await this.kafsService.addAudsToKaf(parentKafId, audsTitles);
    return { ok: true, message: 'Аудитории созданы и добавлены' };
  }

  // GET /api/find_by_kaf?kafId=
  @Get('find_by_kaf')
  findByKaf(@Query('kafId') kafId: string) {
    return this.kafsService.findByIdWithAuds(kafId);
  }

  // GET /api/get_kafs?populate=1
  @Get('get_kafs')
  getKafs(@Query('populate') populate?: string) {
    return this.kafsService.getKafs(Boolean(populate));
  }
}


