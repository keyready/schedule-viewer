'use client';

import {
    DatePageTitle,
    ScheduleFilters,
    ScheduleGridLoading,
    ScheduleList,
    useCurrentDaySchedule,
    useScheduleFilters,
} from '@/entities/schedule';

export const ScheduleWidget = () => {
    const { day, setDay, classroom, setClassroom, lectern, setLectern } = useScheduleFilters();

    const { data: schedule, isLoading } = useCurrentDaySchedule({ workDir: '../files/', day });

    if (isLoading) {
        return (
            <div className="flex w-full flex-col items-center justify-center">
                <DatePageTitle viewedDay={day} setViewedDay={setDay} />
                <div className="w-full relative gap-5 flex">
                    <ScheduleFilters
                        selectedClassroom={classroom}
                        setSelectedClassroom={setClassroom}
                        selectedLectern={lectern}
                        setSelectedLectern={setLectern}
                        day={day}
                        onDayChange={setDay}
                    />
                    <ScheduleGridLoading />
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col items-center justify-center">
            <DatePageTitle viewedDay={day} setViewedDay={setDay} />

            <div className="w-full relative gap-5 flex">
                <ScheduleFilters
                    selectedClassroom={classroom}
                    setSelectedClassroom={setClassroom}
                    selectedLectern={lectern}
                    setSelectedLectern={setLectern}
                    day={day}
                    onDayChange={setDay}
                />

                {schedule && (
                    <ScheduleList classroom={classroom} lectern={lectern} schedule={schedule} />
                )}
            </div>
        </div>
    );
};

