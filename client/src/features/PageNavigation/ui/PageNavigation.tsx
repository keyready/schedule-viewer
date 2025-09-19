import { AnchorLink } from '@/shared/lib/hooks/useScrollSpy';
import { classNames } from '@/shared/lib/classNames/classNames';
import type { GroupedSchedule } from 'entities/ScheduleDay';

interface PageNavigateProps {
    currentSchedule: GroupedSchedule | [];
    activeCourse: string | null;
}

export const PageNavigation = (props: PageNavigateProps) => {
    const { currentSchedule, activeCourse } = props;

    return (
        <div className="w-54 h-fit top-0 sticky">
            <h1 className="text-xl pb-3 font-bold">Навигация</h1>
            <div className="flex flex-col gap-1">
                {Object.keys(currentSchedule)
                    .reverse()
                    .map((course) => (
                        <AnchorLink
                            className={classNames(
                                activeCourse?.split('-')[1] === course ? 'underline' : '',
                                {},
                                ['gap-2 flex'],
                            )}
                            to={`course-${course}`}
                            key={course}
                        >
                            {activeCourse?.split('-')[1] === course && '#'} {course} курс
                        </AnchorLink>
                    ))}
            </div>
        </div>
    );
};
