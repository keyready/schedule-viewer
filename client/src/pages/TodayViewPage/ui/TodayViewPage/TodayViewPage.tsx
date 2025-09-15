import { classNames } from 'shared/lib/classNames/classNames';
import { Page } from 'widgets/Page/Page';
import { memo, useEffect, useState } from 'react';
import { useCurrentDaySchedule } from 'entities/ScheduleDay';
import Cookie from 'js-cookie';
import { CurrentDayGroupCard } from 'entities/Group';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from 'shared/config/routeConfig/routeConfig';
import { useDays } from 'shared/lib/hooks/useDays/useDays';
import classes from './TodayViewPage.module.scss';
import { AnchorLink, AnchorProvider } from '@/shared/lib/hooks/useScrollSpy';

interface TodayViewPageProps {
    className?: string;
}

const TodayViewPage = memo((props: TodayViewPageProps) => {
    const { className } = props;

    useEffect(() => {
        document.title = 'Сегодня';
    }, []);

    const navigate = useNavigate();

    const [activeCourse, setActiveCourse] = useState<string | null>('');

    const { data: currentSchedule } = useCurrentDaySchedule({
        workDir: Cookie.get('workDir') || '',
    });

    const day = useDays(new Date(), { isLower: true });

    if (!currentSchedule) {
        return (
            <Page className={classNames('flex flex-col', {}, [className])}>
                <h1 className={classes.header}>Загрузка...</h1>
            </Page>
        );
    }

    return (
        <AnchorProvider
            onActiveChange={setActiveCourse}
            ids={Object.keys(currentSchedule).map((key) => `course-${key}`)}
        >
            <Page className={classNames('flex flex-col', {}, [className])}>
                <h1 className={classes.header}>
                    Сегодня {new Date().toLocaleDateString('ru-RU')}, {day}
                </h1>

                <div className="flex gap-4 relative">
                    <div className="w-54 h-fit top-0 sticky">
                        <h1 className="text-xl pb-3 font-bold">Навигация</h1>
                        <div className="flex flex-col gap-1">
                            {Object.keys(currentSchedule)
                                .reverse()
                                .map((course) => (
                                    <AnchorLink
                                        className={classNames(
                                            activeCourse?.split('-')[1] === course
                                                ? 'underline'
                                                : '',
                                            {},
                                            ['gap-2 flex'],
                                        )}
                                        to={`course-${course}`}
                                        key={course}
                                    >
                                        {activeCourse?.split('-')[1] === course && '#'} {course}{' '}
                                        курс
                                    </AnchorLink>
                                ))}
                        </div>
                    </div>

                    <div className="flex w-full flex-col gap-5">
                        {Object.entries(currentSchedule)
                            .reverse()
                            .map(([course, groups]) => (
                                <div
                                    key={course}
                                    id={`course-${course}`}
                                    className="flex flex-col gap-4"
                                >
                                    <AnchorLink
                                        className="indent-5 text-3xl font-bold"
                                        to={`course-${course}`}
                                        key={course}
                                    >
                                        {course} курс
                                    </AnchorLink>
                                    <div className={classes.grid}>
                                        {groups.map((group) => (
                                            <CurrentDayGroupCard
                                                onClick={() =>
                                                    navigate(
                                                        `${RoutePath.schedule}?group=${group.groupName}`,
                                                    )
                                                }
                                                group={group}
                                                key={group.groupName}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </Page>
        </AnchorProvider>
    );
});

export default TodayViewPage;
