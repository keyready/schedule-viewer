import { AnchorLink } from '@/shared/lib/hooks/useScrollSpy';
import { CurrentDayGroupCard } from 'entities/Group';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig';
import { GroupedSchedule, ScheduleDay } from '../../model/types/ScheduleDay';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { IKaf } from 'pages/SchedulePage';

interface ScheduleGridProps {
    currentSchedule: GroupedSchedule | [];
    filteredClassroom?: IKaf;
    filteredLectern?: IKaf;
}

export const ScheduleGrid = (props: ScheduleGridProps) => {
    const { currentSchedule, filteredClassroom, filteredLectern } = props;

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

    return Object.entries(currentSchedule)
        .reverse()
        .map(([course, groups]) => (
            <div key={course} id={`course-${course}`} className="flex flex-col gap-4">
                <AnchorLink
                    className="indent-5 text-3xl font-bold"
                    to={`course-${course}`}
                    key={course}
                >
                    {course} курс
                </AnchorLink>
                <div className="grid gap-4 grid-cols-3">
                    {filteredGroups(groups)?.length ? (
                        filteredGroups(groups).map((group) => (
                            <CurrentDayGroupCard
                                onClick={() =>
                                    navigate(`${RoutePath.schedule}?group=${group.groupName}`)
                                }
                                group={group}
                                key={group.groupName}
                            />
                        ))
                    ) : (
                        <h1 className="ml-10 col-span-4 text-red-800 text-xl">
                            На этом курсе нет занятий в выбранной аудитории
                        </h1>
                    )}
                </div>
            </div>
        ));
};
