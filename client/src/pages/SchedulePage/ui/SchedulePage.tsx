import { classNames } from 'shared/lib/classNames/classNames';
import { Page } from 'widgets/Page/Page';
import { memo, useCallback, useEffect, useState } from 'react';
import { useURLParams } from 'shared/url/useSearchParams/useSearchParams';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from 'shared/config/routeConfig/routeConfig';
import { ScheduleDayCard, useSchedule } from 'entities/ScheduleDay';
import Cookie from 'js-cookie';
import { HStack, VStack } from 'shared/UI/Stack';
import { Button } from 'shared/UI/Button';
import { useSubjects } from 'entities/Subject';
import { Input } from 'shared/UI/Input';
import classes from './SchedulePage.module.scss';

interface SchedulePageProps {
    className?: string;
}

const SchedulePage = memo((props: SchedulePageProps) => {
    const { className } = props;

    const { getSearchParams } = useURLParams();
    const navigate = useNavigate();

    const [isSearchFieldVisible, setIsSearchFieldVisible] =
        useState<boolean>(false);
    const [searchDate, setSearchDate] = useState<string>('');

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

    const handleSearchBtnClick = useCallback(() => {
        setIsSearchFieldVisible(!isSearchFieldVisible);
    }, [isSearchFieldVisible]);
    const handleSearchSubmit = useCallback(() => {
        const sch = schedule?.filter(
            (day) => day.date === new Date(searchDate),
        );
        console.log(searchDate, 'привет мр');
    }, [schedule, searchDate]);

    if (!subjects || isSubjectsLoading) {
        return <h2>привет</h2>;
    }

    return (
        <Page
            className={classNames(classes.SchedulePage, {}, [
                className,
            ])}
        >
            <VStack maxW>
                <h1 className={classes.title}>{`${
                    getSearchParams()[0].value
                } группа`}</h1>

                <HStack maxW justify="end">
                    {/* <VStack maxW justify="between"> */}
                    {/*    <p>Командир группы: __commander__</p> */}
                    {/*    <p> */}
                    {/*        Телефон для связи:{' '} */}
                    {/*        <a */}
                    {/*            className={classes.phone} */}
                    {/*            href="tel: 89990123456" */}
                    {/*        > */}
                    {/*            8 999 012 3456 */}
                    {/*        </a> */}
                    {/*    </p> */}
                    {/* </VStack> */}
                    {isSearchFieldVisible ? (
                        <HStack maxW>
                            <Input
                                value={searchDate}
                                onChange={setSearchDate}
                                autoFocus
                                placeholder="Введите дату в формате ДД:ММ:ГГ"
                            />
                            <Button onClick={handleSearchSubmit}>
                                Поиск
                            </Button>
                        </HStack>
                    ) : (
                        <Button onClick={handleSearchBtnClick}>
                            Поиск
                        </Button>
                    )}
                </HStack>
            </VStack>

            <div className={classes.grid}>
                {schedule?.length &&
                    schedule
                        // .filter(
                        //     (day) =>
                        //         new Date(day.date).getMonth() ===
                        //             new Date().getMonth() &&
                        //         new Date(day.date).getDate() >=
                        //             new Date().getDate(),
                        // )
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
