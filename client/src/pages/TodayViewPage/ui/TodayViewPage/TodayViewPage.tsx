import { classNames } from 'shared/lib/classNames/classNames';
import { Page } from 'widgets/Page/Page';
import { memo, useCallback, useEffect, useState } from 'react';
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
import { IKaf } from '../../../SchedulePage';
import { DateValue, parseDate } from '@internationalized/date';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig';
import { cn } from '@heroui/react';

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
    const [selectedKaf, setSelectedKaf] = useState<IKaf>();
    const [selectedClassroom, setSelectedClassroom] = useState<IKaf>();
    const [selectedDate, setSelectedDate] = useState<DateValue | null>(
        parseDate(new Date().toISOString().split('T')[0]),
    );

    const {
        data: currentSchedule,
        isLoading,
        isFetching,
    } = useCurrentDaySchedule({
        workDir: Cookie.get('workDir') || '',
        day: selectedDate?.toString(),
    });

    const handleSettingsPageClick = useCallback(() => {
        navigate(RoutePath.main);
    }, [navigate]);

    if (!Cookie.get('workDir'))
        return (
            <Page
                className={classNames('flex items-center justify-center flex-col', {}, [className])}
            >
                <h1 className={classes.header}>
                    Для получения расписание введите путь до директории{' '}
                    <button className="text-blue-800" onClick={handleSettingsPageClick}>
                        здесь
                    </button>
                </h1>
            </Page>
        );

    if (isLoading) {
        return (
            <Page className={classNames('flex flex-col', {}, [className])}>
                <PageTitle viewedDay={selectedDate} setViewedDay={setSelectedDate} />
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
            <Page
                className={classNames('flex items-center justify-center flex-col', {}, [className])}
            >
                <h1 className={cn(classes.header, 'text-danger')}>
                    Ошибка получения расписания...
                </h1>
            </Page>
        );

    return (
        <AnchorProvider
            onActiveChange={setActiveCourse}
            ids={currentSchedule ? Object.keys(currentSchedule).map((key) => `course-${key}`) : []}
        >
            <Page className={classNames('flex flex-col', {}, [className])}>
                <PageTitle viewedDay={selectedDate} setViewedDay={setSelectedDate} />

                <div className="flex gap-4 relative">
                    <PageNavigation
                        selectedKaf={selectedKaf}
                        setSelectedKaf={setSelectedKaf}
                        selectedClassroom={selectedClassroom}
                        setSelectedClassroom={setSelectedClassroom}
                        currentSchedule={currentSchedule || []}
                        activeCourse={activeCourse}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                    />
                    <div className="flex w-full flex-col gap-5">
                        {isFetching || isLoading ? (
                            <ScheduleGridLoading />
                        ) : (
                            <ScheduleGrid
                                filteredDate={selectedDate}
                                filteredClassroom={selectedClassroom}
                                filteredLectern={selectedKaf}
                                currentSchedule={currentSchedule || []}
                            />
                        )}
                    </div>
                </div>
            </Page>
        </AnchorProvider>
    );
});

export default TodayViewPage;
