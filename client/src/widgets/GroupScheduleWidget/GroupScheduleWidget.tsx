'use client';

import { useMemo } from 'react';
import { DayScheduleCard, useGroupScheduleApi } from '@/entities/schedule';
import { groupByWeeks } from '@/shared/lib';
import { AnchorProvider } from '@/shared/lib/ScrollProvider';

export const GroupScheduleWidget = ({ groupName }: { groupName: string }) => {
    const { data: schedule, isLoading } = useGroupScheduleApi({ groupName });

    const ids = useMemo(
        () =>
            groupByWeeks(schedule || []).map((week) =>
                new Date(week[0].date).toLocaleDateString('ru-RU'),
            ),
        [schedule],
    );

    if (isLoading) {
        return <h1>Загрузка...</h1>;
    }

    return (
        <AnchorProvider ids={ids}>
            <div id="schedule-grids" className="flex w-3/4 flex-col gap-10">
                {groupByWeeks(schedule || []).map((week, weekIndex) => {
                    if (!week.length) return null;
                    const startId = new Date(week[0].date).toLocaleDateString('ru-RU');
                    return (
                        <div id={startId} key={weekIndex} className="grid grid-cols-3 gap-3">
                            {week.map((day) => (
                                <DayScheduleCard key={crypto.randomUUID()} groupView day={day} />
                            ))}
                        </div>
                    );
                })}
            </div>
        </AnchorProvider>
    );
};
