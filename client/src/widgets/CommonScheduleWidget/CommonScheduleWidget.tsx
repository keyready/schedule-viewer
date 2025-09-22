'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
    DatePageTitle,
    ScheduleFilters,
    ScheduleGridLoading,
    ScheduleList,
    useCurrentDaySchedule,
    useScheduleFilters,
} from '@/entities/schedule';

export const CommonScheduleWidget = () => {
    const { day, setDay, classroom, setClassroom, lectern, setLectern } = useScheduleFilters();

    const { data: schedule, isLoading } = useCurrentDaySchedule({ workDir: '../files/', day });

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

                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex-1"
                        >
                            <ScheduleGridLoading />
                        </motion.div>
                    ) : (
                        schedule && (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex-1"
                            >
                                <ScheduleList
                                    classroom={classroom}
                                    lectern={lectern}
                                    schedule={schedule}
                                />
                            </motion.div>
                        )
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
