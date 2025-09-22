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
            <div className="p-3 rounded-md w-64 h-80 bg-red-200 sticky top-5">
                <p>Загрузка...</p>
            </div>
        );
    }

    return (
        <AnchorProvider ids={ids} onActiveChange={setActiveId}>
            <div className="p-3 rounded-md w-72 h-fit sticky top-5 overflow-y-auto">
                <h1 className="text-xl pb-3 font-bold">Недели</h1>
                <div className="overflow-auto h-72 flex flex-col gap-2">
                    {weeks.map((week) => {
                        if (!week.length) return null;

                        const start = new Date(week[0].date);
                        const end = new Date(week[week.length - 1].date);
                        const id = new Date(week[0].date).toLocaleDateString('ru-RU');

                        return (
                            <AnchorLink
                                key={id}
                                to={id}
                                className={cn(
                                    'flex gap-2 text-sm',
                                    'cursor-pointer text-left px-2 py-1 rounded duration-200',
                                    'hover:bg-nav hover:text-white',
                                    activeId === id ? 'ml-0 fill-red-500' : 'ml-7 fill-green-400',
                                )}
                            >
                                {activeId === id && (
                                    <div className="w-5 h-5 flex-[1_0_auto]">
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
                        );
                    })}
                </div>
            </div>
        </AnchorProvider>
    );
};
