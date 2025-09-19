import { classNames } from 'shared/lib/classNames/classNames';
import { Page } from 'widgets/Page/Page';
import { memo, useEffect, useState } from 'react';
import { useURLParams } from 'shared/url/useSearchParams/useSearchParams';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from 'shared/config/routeConfig/routeConfig';
import { ScheduleDay, ScheduleDayCard, useSchedule } from 'entities/ScheduleDay';
import Cookie from 'js-cookie';
import { HStack, VStack } from 'shared/UI/Stack';
import { useSubjects } from 'entities/Subject';
import classes from './SchedulePage.module.scss';
import { IKaf } from '../api/fetchKafsApi';

interface SchedulePageProps {
    className?: string;
}

const SchedulePage = memo((props: SchedulePageProps) => {
    const { className } = props;

    const { getSearchParams } = useURLParams();
    const navigate = useNavigate();

    const [filteredDays] = useState<ScheduleDay[]>([]);
    const [isFilterEnabled] = useState<boolean>(false);
    const [electedKaf] = useState<IKaf | null>(null);

    useEffect(() => {
        document.title = `Расписание группы ${getSearchParams()[0]?.value}`;
    }, [getSearchParams]);

    if (!getSearchParams()[0]?.value) {
        navigate(RoutePath.main);
    }

    const { data: schedule } = useSchedule({
        workDir: Cookie.get('workDir') || '',
        group: getSearchParams()[0]?.value,
        kafId: electedKaf?._id || '',
    });

    const { data: subjects } = useSubjects(getSearchParams()[0]?.value || '');

    return (
        <Page className={classNames(classes.SchedulePage, {}, [className])}>
            <VStack maxW>
                <h1 className={classes.title}>{`${getSearchParams()[0].value} группа`}</h1>
            </VStack>

            {schedule?.length && !filteredDays?.length && !isFilterEnabled && (
                <div className={classes.grid}>
                    {schedule
                        .filter(
                            (day) =>
                                new Date(day.date).getTime() >=
                                new Date(new Date().setDate(new Date().getDate() - 1)).getTime(),
                        )
                        .map((day, index) => (
                            <ScheduleDayCard
                                title={day.date.toLocaleString()}
                                key={index}
                                jobs={day.jobs}
                                subjects={subjects || []}
                            />
                        ))}
                </div>
            )}

            {filteredDays?.length ? (
                <div className={classes.grid}>
                    {filteredDays
                        .filter((day) => new Date(day.date).getTime() >= new Date().getTime())
                        .map((day, index) => (
                            <ScheduleDayCard
                                title={day.date.toLocaleString()}
                                key={index}
                                jobs={day.jobs}
                                subjects={subjects || []}
                            />
                        ))}
                </div>
            ) : (
                ''
            )}

            {isFilterEnabled && !filteredDays?.length && (
                <HStack maxW className={classes.scheduleEmpty} justify="center">
                    <h2>Расписание закончилось...</h2>
                </HStack>
            )}
        </Page>
    );
});

export default SchedulePage;
