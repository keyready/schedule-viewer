import { classNames } from 'shared/lib/classNames/classNames';
import { Page } from 'widgets/Page/Page';
import { memo, useEffect } from 'react';
import { useCurrentDaySchedule } from 'entities/ScheduleDay';
import Cookie from 'js-cookie';
import { CurrentDayGroupCard } from 'entities/Group';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from 'shared/config/routeConfig/routeConfig';
import { useDays } from 'shared/lib/hooks/useDays/useDays';
import classes from './TodayViewPage.module.scss';

interface TodayViewPageProps {
    className?: string;
}

const TodayViewPage = memo((props: TodayViewPageProps) => {
    const { className } = props;

    useEffect(() => {
        document.title = 'Сегодня';
    }, []);

    const navigate = useNavigate();

    const { data: currentSchedule, isLoading: isScheduleLoading } = useCurrentDaySchedule({
        workDir: Cookie.get('workDir') || '',
    });
    const day = useDays(new Date(), { isLower: true });

    return (
        <Page className={classNames(classes.TodayViewPage, {}, [className])}>
            <h1 className={classes.header}>
                Сегодня {new Date().toLocaleDateString('ru-RU')}, {day}
            </h1>

            <div className={classes.grid}>
                {currentSchedule?.length &&
                    currentSchedule?.map((group) => (
                        <CurrentDayGroupCard
                            onClick={() =>
                                navigate(`${RoutePath.schedule}?group=${group.groupName}`)
                            }
                            group={group}
                            key={group.groupName}
                        />
                    ))}
            </div>
        </Page>
    );
});

export default TodayViewPage;
