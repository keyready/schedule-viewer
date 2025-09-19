import { AnchorLink } from '@/shared/lib/hooks/useScrollSpy';
import { CurrentDayGroupCard } from 'entities/Group';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig';
import { GroupedSchedule, ScheduleDay } from '../../model/types/ScheduleDay';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { IKaf } from 'pages/SchedulePage';
import { AnimatePresence, motion } from 'framer-motion';
import { DateValue } from '@internationalized/date';

interface ScheduleGridProps {
    currentSchedule: GroupedSchedule | [];
    filteredDate?: DateValue | null;
    filteredClassroom?: IKaf;
    filteredLectern?: IKaf;
}

export const ScheduleGrid = (props: ScheduleGridProps) => {
    const { currentSchedule, filteredDate, filteredClassroom, filteredLectern } = props;

    const navigate = useNavigate();

    const filterClassrooms = useCallback(
        (group: ScheduleDay) => {
            if (!filteredClassroom?.title && !filteredLectern?.title) {
                return true;
            }

            const lecternKaf = filteredLectern?.title?.split(' | ')[0];
            const classroomTitle = filteredClassroom?.title;

            const matchesLectern = !lecternKaf || group.kaf === lecternKaf;

            const matchesClassroom =
                !classroomTitle ||
                group.jobs.some(
                    (job) =>
                        job.includes('аудитория: ') &&
                        job.split('аудитория: ')[1] === classroomTitle,
                );

            return matchesLectern && matchesClassroom;
        },
        [filteredClassroom?.title, filteredLectern?.title],
    );

    const filteredGroups = useCallback(
        (groups: ScheduleDay[]) => {
            return groups.filter(filterClassrooms);
        },
        [filterClassrooms],
    );

    return (
        <div>
            {Object.entries(currentSchedule)
                .reverse()
                .map(([course, groups]) => (
                    <motion.div
                        key={`${course}-${filteredDate?.toString()}`}
                        id={`course-${course}`}
                        className="flex flex-col gap-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        <AnchorLink
                            className="indent-5 text-3xl font-bold"
                            to={`course-${course}`}
                            key={course}
                        >
                            {course} курс
                        </AnchorLink>

                        <AnimatePresence mode="wait">
                            <div className="grid gap-4 grid-cols-3">
                                {filteredGroups(groups)?.length ? (
                                    filteredGroups(groups).map((group) => (
                                        <motion.div
                                            key={`${group.groupName}-${group.date}`}
                                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                            transition={{ duration: 0.3, ease: 'easeOut' }}
                                        >
                                            <CurrentDayGroupCard
                                                onClick={() =>
                                                    navigate(
                                                        `${RoutePath.schedule}?group=${group.groupName}`,
                                                    )
                                                }
                                                group={group}
                                            />
                                        </motion.div>
                                    ))
                                ) : (
                                    <motion.h1
                                        key={`not-found-${course}`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.2 }}
                                        transition={{ duration: 0.3, ease: 'easeOut' }}
                                        className="ml-10 col-span-4 text-red-800 text-xl"
                                    >
                                        На этом курсе нет занятий в выбранной аудитории
                                    </motion.h1>
                                )}
                            </div>
                        </AnimatePresence>
                    </motion.div>
                ))}
        </div>
    );
};
