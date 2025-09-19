import { AnchorLink } from '@/shared/lib/hooks/useScrollSpy';
import { CurrentDayGroupCard } from 'entities/Group';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig';
import { GroupedSchedule } from '../../model/types/ScheduleDay';
import { useNavigate } from 'react-router-dom';

export const ScheduleGrid = ({ currentSchedule }: { currentSchedule: GroupedSchedule | [] }) => {
    const navigate = useNavigate();

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
                    {groups.map((group) => (
                        <CurrentDayGroupCard
                            onClick={() =>
                                navigate(`${RoutePath.schedule}?group=${group.groupName}`)
                            }
                            group={group}
                            key={group.groupName}
                        />
                    ))}
                </div>
            </div>
        ));
};
