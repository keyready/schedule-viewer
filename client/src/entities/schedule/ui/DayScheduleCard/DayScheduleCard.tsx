'use client';

import { Accordion, AccordionItem } from '@heroui/accordion';
import { useCallback, useMemo } from 'react';
import type { ScheduleDay, ScheduleGroupDay } from '../../model/types/schedule';
import { useSubjects } from '@/entities/subject';

const DISABLED_DAY_TYPES = [
    'самоподготовка',
    'выходной день',
    'хоз. день',
    'отп',
    'ср',
    'умо',
    'вых',
    'оп',
    'тсу',
    'стаж',
] as const;

interface DayScheduleCardProps {
    day: ScheduleGroupDay;
}

export const DayScheduleCard = ({ day }: DayScheduleCardProps) => {
    const { data: subjects, isLoading: isSubjectsLoading } = useSubjects({
        groupNumber: day.groupName,
    });

    const dayData = useMemo<ScheduleDay[]>(() => {
        if (!day.jobs?.length) return [];

        return day.jobs.map((job) => {
            const parts = job.split(', ');
            return {
                type: (parts[0]?.split(': ')[1] || parts[0]?.split(': ')[0] || '').trim(),
                title: (parts[1]?.split(': ')[1] || '').trim(),
                classroom: (parts[2]?.split(': ')[1] || '').trim(),
            };
        });
    }, [day.jobs]);

    const subjectMap = useMemo(() => {
        if (!subjects?.length) return new Map<string, any>();
        return new Map(subjects.map((sub) => [sub.abbr?.toUpperCase(), sub]));
    }, [subjects]);

    const isCellDisabled = useCallback(
        (dayType: string, dayTitle: string) =>
            DISABLED_DAY_TYPES.includes(
                dayType.toLowerCase() as (typeof DISABLED_DAY_TYPES)[number],
            ) ||
            DISABLED_DAY_TYPES.includes(
                dayTitle.toLowerCase() as (typeof DISABLED_DAY_TYPES)[number],
            ),
        [],
    );

    if (isSubjectsLoading) {
        return (
            <div className="w-full p-3 rounded flex flex-col items-center justify-center">
                <h2 className="font-bold text-center text-2xl">{day.groupName} уч. гр.</h2>
                <p className="mt-4 text-gray-500">Загрузка расписания...</p>
            </div>
        );
    }

    if (!dayData.length) {
        return (
            <div className="w-full p-3 rounded flex flex-col items-center justify-center">
                <h2 className="font-bold text-center text-2xl">{day.groupName} уч. гр.</h2>
                <p className="mt-4 text-gray-500">Нет занятий на этот день</p>
            </div>
        );
    }

    return (
        <div className="w-full bg-blue-900/20 h-fit p-3 rounded-lg flex flex-col items-center">
            <h2 className="font-bold text-center text-xl">{day.groupName} уч. гр.</h2>

            <Accordion isCompact className="mt-4 h-fit w-full">
                {dayData.map((item, index) => {
                    const subject = subjectMap.get(item.title.toUpperCase());
                    const isDisabled = isCellDisabled(item.type, item.title);

                    const lessonType = item.type.split('/')[0] === 'П' ? 'Практика' : 'Лекция';
                    const group = item.type.split('/')[1] || '';

                    return (
                        <AccordionItem
                            key={index}
                            isDisabled={isDisabled}
                            aria-label={item.title || item.type}
                            title={
                                <div className="flex w-full justify-between">
                                    <span>{(item.title || item.type).toUpperCase()}</span>
                                    <span>{item.classroom}</span>
                                </div>
                            }
                        >
                            <div className="flex flex-col px-2 py-2">
                                <h2 className="leading-none text-center text-sm">
                                    {subject?.title?.toUpperCase() || 'Неизвестный предмет'}
                                </h2>

                                <div className="flex justify-between text-xs mt-2">
                                    <span>{lessonType}</span>
                                    <span>{group || '—'}</span>
                                </div>

                                <div className="flex justify-between text-xs mt-1">
                                    <span>Преподаватель</span>
                                    <span>{subject?.trainer?.split('; ')[0] || '—'}</span>
                                </div>

                                <div className="flex justify-between text-xs mt-1">
                                    <span>Кафедра</span>
                                    <span>{subject?.lectern || '—'}</span>
                                </div>
                            </div>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
};
