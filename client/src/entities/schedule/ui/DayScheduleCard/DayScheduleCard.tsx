'use client';

import { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@heroui/theme';
import Link from 'next/link';
import type { ScheduleDay, ScheduleGroupDay } from '../../model/types/schedule';
import { useSubjects } from '@/entities/subject';
import { DISABLED_DAY_TYPES } from '../../model/consts/daytypes';
import { Subject } from '@/entities/subject/model/types/subject';
import { CardModal } from '@/shared/ui/CardModal';

interface DayScheduleCardProps {
    day: ScheduleGroupDay;
    groupView?: boolean;
}

export const DayScheduleCard = ({ day, groupView = false }: DayScheduleCardProps) => {
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
        if (!subjects?.length) return new Map<string, Subject>();
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

    const renderCardTitle = useMemo(() => {
        if (groupView) {
            return (
                <div className="w-full">
                    <h2 className="text-center text-xl font-bold">
                        {new Date(day.date).toLocaleDateString('ru-RU')}
                        {', '}
                        {new Date(day.date).toLocaleDateString('ru-RU', {
                            weekday: 'short',
                        })}
                    </h2>
                </div>
            );
        }

        return (
            <Link
                prefetch
                href={`/group/${day.groupName}#${new Date().toLocaleDateString('ru-RU')}`}
                className={cn(
                    'w-full cursor-pointer rounded-md outline-2 outline-transparent',
                    'flex flex-row-reverse items-center justify-center gap-1',
                    'hover:outline-b-2 hover:outline-nav hover:bg-nav/20 duration-200 hover:scale-103',
                )}
            >
                <div className="h-5 w-5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        {/* eslint-disable-next-line max-len */}
                        <path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19L18.9999 6.413L11.2071 14.2071L9.79289 12.7929L17.5849 5H13V3H21Z" />
                    </svg>
                </div>
                <h2 className="text-center text-xl font-bold">{day.groupName} уч. гр.</h2>
            </Link>
        );
    }, [day.date, day.groupName, groupView]);

    if (isSubjectsLoading) {
        return (
            <motion.div
                className="flex w-full flex-col items-center justify-center rounded p-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <motion.h2
                    className="text-center text-2xl font-bold"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                >
                    {day.groupName} уч. гр.
                </motion.h2>
                <motion.p
                    className="mt-4 text-gray-500"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                >
                    Загрузка расписания...
                </motion.p>
            </motion.div>
        );
    }

    if (!dayData.length) {
        return (
            <motion.div
                className="flex w-full flex-col items-center justify-center rounded p-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <motion.h2
                    className="text-center text-2xl font-bold"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                >
                    {day.groupName} уч. гр.
                </motion.h2>
                <motion.p
                    className="mt-4 text-gray-500"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                >
                    Нет занятий на этот день
                </motion.p>
            </motion.div>
        );
    }

    return (
        <div
            id={new Date(day.date).toLocaleDateString('ru-RU')}
            className={cn(
                'flex h-fit w-full flex-col items-center',
                'outline-nav rounded-lg p-3 outline outline-2',
                groupView &&
                    new Date().toLocaleDateString('ru-RU') ===
                        new Date(day.date).toLocaleDateString('ru-RU')
                    ? 'bg-grad-start'
                    : '',
            )}
        >
            {renderCardTitle}

            <div className="mt-4 flex h-fit w-full flex-col">
                <div className="flex w-full justify-between text-sm italic opacity-30">
                    <span>Дисциплина</span>
                    <span>Аудитория</span>
                </div>
                {dayData.map((item, index) => {
                    const subject = subjectMap.get(item.title.toUpperCase());
                    const isDisabled = isCellDisabled(item.type, item.title);

                    const lessonType = item.type.split('/')[0] === 'П' ? 'Практика' : 'Лекция';
                    const group = (item.type.split('/')[1] || '')
                        .replace('.', '')
                        .replace('Т', 'тема ');

                    return (
                        <div
                            key={index}
                            className={cn(
                                'border-nav border-b-1 px-1.5 py-1.5 duration-100',
                                isDisabled ? '' : 'hover:bg-nav/10',
                                'last:border-none',
                            )}
                        >
                            <CardModal
                                key={index}
                                isDisabled={isDisabled}
                                cardClassName="w-full"
                                id={crypto.randomUUID()}
                                altContent={
                                    <div className="flex flex-col items-center px-2">
                                        <h2 className="w-2/3 text-center leading-none font-bold">
                                            {subject?.title?.toUpperCase() || 'Неизвестный предмет'}
                                        </h2>

                                        <div className="mt-2 flex w-full justify-between">
                                            <span>{lessonType}</span>
                                            <span>{group || '—'}</span>
                                        </div>

                                        <div className="mt-1 flex w-full justify-between gap-3">
                                            <span>Преподаватель</span>
                                            <span className="truncate">
                                                {subject?.trainer?.split('; ')[0] || '—'}
                                            </span>
                                        </div>

                                        <div className="mt-1 flex w-full justify-between">
                                            <span>Кафедра</span>
                                            <span>{subject?.lectern || '—'}</span>
                                        </div>
                                    </div>
                                }
                            >
                                <div
                                    className={cn(
                                        'flex w-full justify-between text-sm',
                                        isDisabled && 'opacity-60',
                                    )}
                                >
                                    <span>{(item.title || item.type).toUpperCase()}</span>
                                    <div className="flex gap-2">
                                        <span>{item.classroom}</span>
                                        {!isDisabled && (
                                            <div className="h-5 w-5">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                >
                                                    {/* eslint-disable-next-line max-len */}
                                                    <path d="M12 10.0858L7.20711 5.29291L5.79289 6.70712L12 12.9142L18.2071 6.70712L16.7929 5.29291L12 10.0858ZM18 17L6 17L6 15L18 15V17Z"></path>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardModal>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
