import { Controller, Get, Query } from '@nestjs/common';
import { ParserService } from '../../shared/parser/parser.service';
import * as path from 'path';
import * as fs from 'fs';

@Controller('api')
export class ScheduleController {
  constructor(private readonly parser: ParserService) {}

  private getFilesDir() {
    return process.env.FILES_DIR || path.resolve(__dirname, '../../..', 'files');
  }

  @Get('groups')
  getGroups() {
    const filesDir = this.getFilesDir();
    const files = fs.readdirSync(filesDir);
    const title = files.filter((file) => file.endsWith('.xlsx') && !file.startsWith('~')).map((file) => path.basename(file).split('.')[0]);
    return title;
  }

  @Get('subjects')
  getSubjects(@Query('group') group?: string) {
    const filesDir = this.getFilesDir();
    const safeGroup = path.basename(group || '');
    const filePath = path.resolve(filesDir, `${safeGroup}.xlsx`);
    const subjects = this.parser.getRange(filePath, 'A39:O60');
    const filteredSubjects = subjects.filter((s: any) => s.abbr?.length > 0 && s.abbr?.length <= 4);
    return filteredSubjects;
  }

  @Get('schedule')
  getSchedule(@Query('group') group?: string) {
    const filesDir = this.getFilesDir();
    const safeGroup = path.basename(group || '');
    const filePath = path.resolve(filesDir, `${safeGroup}.xlsx`);
    let schedule = this.parser.getRectangleFromExcel(filePath, 'D6:Y34');
    schedule = schedule.map((day: any) => ({ ...day, groupName: group }));
    return schedule;
  }

  @Get('today')
  getToday(@Query('viewedDay') viewedDay: string) {
    const filesDir = this.getFilesDir();
    const groupsSchedule: any[] = [];
    let cnt = 0;
    const schedule = fs.readdirSync(filesDir).filter((file) => file.endsWith('.xlsx') && !file.includes('~'));
    schedule.forEach((file) => {
      groupsSchedule.push(this.parser.getRectangleFromExcel(path.resolve(filesDir, file), 'D6:Y34'));
    });
    const result: any[] = [];
    groupsSchedule
      .map((group) => group.filter((day: any) => {
        const today = new Date(viewedDay).setHours(0, 0, 0, 0);
        const date = new Date(day.date).setHours(0, 0, 0, 0);
        return today === date;
      }))
      .filter((group) => !group?.jobs)
      .map((group) => {
        group[0] = { ...group[0], groupName: schedule[cnt]?.split('.')[0] };
        cnt += 1;
        return result.push(group[0]);
      });
    return result;
  }
}


