import { classNames } from 'shared/lib/classNames/classNames';
import { Page } from 'widgets/Page/Page';
import { memo, useEffect } from 'react';
import { useURLParams } from 'shared/url/useSearchParams/useSearchParams';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from 'shared/config/routeConfig/routeConfig';
import { ScheduleDayCard, useSchedule } from 'entities/ScheduleDay';
import Cookie from 'js-cookie';
import { HStack, VStack } from 'shared/UI/Stack';
import { Button } from 'shared/UI/Button';
import { useSubjects } from 'entities/Subject';
import classes from './SchedulePage.module.scss';

interface SchedulePageProps {
    className?: string;
}

const SchedulePage = memo((props: SchedulePageProps) => {
    const { className } = props;

    const { getSearchParams } = useURLParams();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = `Расписание группы ${
            getSearchParams()[0]?.value
        }`;
    }, [getSearchParams]);

    if (!getSearchParams()[0]?.value) {
        navigate(RoutePath.main);
    }

    const { data: schedule } = useSchedule({
        workDir: Cookie.get('workDir') || '',
        group: getSearchParams()[0]?.value,
    });
    const { data: subjects, isLoading: isSubjectsLoading } =
        useSubjects(getSearchParams()[0]?.value || '');

    if (!subjects || isSubjectsLoading) {
        return <h2>привет</h2>;
    }

    return (
        <Page
            className={classNames(classes.SchedulePage, {}, [
                className,
            ])}
        >
            <HStack maxW justify="between">
                <VStack maxW>
                    <h1 className={classes.title}>{`${
                        getSearchParams()[0].value
                    } группа`}</h1>
                    <p>Командир группы: __commander__</p>
                    <p>
                        Телефон для связи:{' '}
                        <a
                            className={classes.phone}
                            href="tel: 89990123456"
                        >
                            8 999 012 3456
                        </a>
                    </p>
                </VStack>
                <Button>Поиск</Button>
            </HStack>

            <div className={classes.grid}>
                {schedule?.length &&
                    schedule
                        .filter(
                            (day) =>
                                new Date(day.date).getMonth() ===
                                    new Date().getMonth() &&
                                new Date(day.date).getDate() >=
                                    new Date().getDate(),
                        )
                        .map((day, index) => (
                            <ScheduleDayCard
                                title={day.date.toLocaleString()}
                                key={index}
                                jobs={day.jobs}
                                subjects={subjects}
                            />
                        ))}
            </div>
        </Page>
    );
});

export default SchedulePage;
