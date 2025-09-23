'use client';

import { useCallback, useMemo, useState } from 'react';
import { cn } from '@heroui/theme';
import { useGroupScheduleApi } from '@/entities/schedule';
import { groupByWeeks } from '@/shared/lib';
import { AnchorLink, AnchorProvider } from '@/shared/lib/ScrollProvider';

export const WeekFilterBlock = ({ groupName }: { groupName: string }) => {
    const { data: schedule, isLoading } = useGroupScheduleApi({ groupName });
    const weeks = groupByWeeks(schedule || []);

    const [activeId, setActiveId] = useState<string | null>(null);

    const formatDate = useCallback(
        (date: Date) =>
            date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
            }),
        [],
    );

    const ids = useMemo(
        () =>
            groupByWeeks(schedule || []).map((week) =>
                new Date(week[0].date).toLocaleDateString('ru-RU'),
            ),
        [schedule],
    );

    if (isLoading) {
        return (
            <div className="sticky top-5 h-80 w-64 rounded-md p-3">
                <p>Загрузка...</p>
            </div>
        );
    }

    return (
        <AnchorProvider ids={ids} onActiveChange={setActiveId}>
            <div className="sticky top-5 h-fit w-1/4 overflow-y-auto rounded-md p-3">
                <h1 className="pb-3 text-xl font-bold">Недели</h1>
                <div className="flex h-72 flex-col gap-2 overflow-auto">
                    {weeks.map((week) => {
                        if (!week.length) return null;

                        const start = new Date(week[0].date);
                        const end = new Date(week[week.length - 1].date);
                        const id = new Date(week[0].date).toLocaleDateString('ru-RU');

                        return (
                            <div
                                key={id}
                                className={cn(
                                    'cursor-pointer rounded px-2 py-1 text-left duration-200',
                                    'hover:bg-nav hover:text-white',
                                )}
                            >
                                <AnchorLink
                                    to={id}
                                    className={cn(
                                        'flex gap-2 text-sm',
                                        activeId === id ? 'ml-0' : 'ml-7',
                                    )}
                                >
                                    {activeId === id && (
                                        <div className="h-5 w-5 flex-[1_0_auto]">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentcolor"
                                            >
                                                <path d="M12 13H4V11H12V4L20 12L12 20V13Z" />
                                            </svg>
                                        </div>
                                    )}
                                    {formatDate(start)} — {formatDate(end)}
                                </AnchorLink>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AnchorProvider>
    );
};
