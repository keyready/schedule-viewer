import { classNames } from 'shared/lib/classNames/classNames';
import { Page } from 'widgets/Page/Page';
import { memo, useEffect, useState } from 'react';
import {
    PageTitle,
    ScheduleGrid,
    ScheduleGridLoading,
    useCurrentDaySchedule,
} from 'entities/ScheduleDay';
import Cookie from 'js-cookie';
import classes from './TodayViewPage.module.scss';
import { AnchorProvider } from '@/shared/lib/hooks/useScrollSpy';
import { PageNavigation } from 'features/PageNavigation';
import { Skeleton } from 'primereact/skeleton';

interface TodayViewPageProps {
    className?: string;
}

const TodayViewPage = memo((props: TodayViewPageProps) => {
    const { className } = props;

    useEffect(() => {
        document.title = 'Сегодня';
    }, []);

    const [activeCourse, setActiveCourse] = useState<string | null>('');
    const [viewedDay, setViewedDay] = useState<Date>(new Date());

    const {
        data: currentSchedule,
        isLoading,
        isFetching,
    } = useCurrentDaySchedule({
        workDir: Cookie.get('workDir') || '',
        day: viewedDay.toISOString(),
    });

    if (isLoading) {
        return (
            <Page className={classNames('flex flex-col', {}, [className])}>
                <PageTitle viewedDay={viewedDay} setViewedDay={setViewedDay} />
                <div className="flex relative gap-4 w-full">
                    <div className="w-54 h-fit sticky top-0 flex flex-col gap-2">
                        <h1 className="text-xl pb-2 font-bold">Навигация</h1>
                        <div className="w-full flex flex-col gap-2">
                            {new Array(5).fill(0).map((_, index) => (
                                <Skeleton width="66%" height="20px" key={index} />
                            ))}
                        </div>
                    </div>
                    <ScheduleGridLoading />
                </div>
            </Page>
        );
    }

    if (!currentSchedule && !isLoading)
        return (
            <Page className={classNames('flex flex-col', {}, [className])}>
                <h1 className={classes.header}>Ошибка получения расписания...</h1>
            </Page>
        );

    return (
        <AnchorProvider
            onActiveChange={setActiveCourse}
            ids={currentSchedule ? Object.keys(currentSchedule).map((key) => `course-${key}`) : []}
        >
            <Page className={classNames('flex flex-col', {}, [className])}>
                <PageTitle viewedDay={viewedDay} setViewedDay={setViewedDay} />

                <div className="flex gap-4 relative">
                    <PageNavigation
                        currentSchedule={currentSchedule || []}
                        activeCourse={activeCourse}
                    />
                    <div className="flex w-full flex-col gap-5">
                        {isFetching || isLoading ? (
                            <ScheduleGridLoading />
                        ) : (
                            <ScheduleGrid currentSchedule={currentSchedule || []} />
                        )}
                    </div>
                </div>
            </Page>
        </AnchorProvider>
    );
});

export default TodayViewPage;
