import { classNames } from 'shared/lib/classNames/classNames';
import { Page } from 'widgets/Page/Page';
import { memo, useCallback, useEffect, useState } from 'react';
import { useURLParams } from 'shared/url/useSearchParams/useSearchParams';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from 'shared/config/routeConfig/routeConfig';
import { ScheduleDay, ScheduleDayCard, useSchedule } from 'entities/ScheduleDay';
import Cookie from 'js-cookie';
import { HStack, VStack } from 'shared/UI/Stack';
import { Button } from 'shared/UI/Button';
import { useSubjects } from 'entities/Subject';
import { Datepicker } from 'widgets/Datepicker';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import classes from './SchedulePage.module.scss';
import { IKaf, useKafs } from '../api/fetchKafsApi';

interface SchedulePageProps {
    className?: string;
}

const SchedulePage = memo((props: SchedulePageProps) => {
    const { className } = props;

    const { getSearchParams } = useURLParams();
    const navigate = useNavigate();

    const [isSearchFieldVisible, setIsSearchFieldVisible] = useState<boolean>(false);
    const [searchDate, setSearchDate] = useState<Date>(new Date());
    const [filteredDays, setFilteredDays] = useState<ScheduleDay[]>([]);
    const [isFilterEnabled, setIsFilterEnabled] = useState<boolean>(false);
    const [electedKaf, setElectedKaf] = useState<IKaf | null>(null);

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
    const { data: kafs } = useKafs();
    const { data: subjects, isLoading: isSubjectsLoading } = useSubjects(
        getSearchParams()[0]?.value || '',
    );

    const handleSearchBtnClick = useCallback(() => {
        setIsSearchFieldVisible(true);
    }, []);
    const handleSearchSubmit = useCallback(() => {
        setFilteredDays(
            schedule?.filter(
                (day) => day.date && new Date(day.date).getTime() >= new Date(searchDate).getTime(),
            ) || [],
        );
        setIsFilterEnabled(true);
    }, [schedule, searchDate]);

    const handleClearFilterDaysClick = useCallback(() => {
        setFilteredDays([]);
        setIsFilterEnabled(false);
        setElectedKaf(null);
    }, []);

    if (!subjects || isSubjectsLoading) {
        return <h2>привет</h2>;
    }

    return (
        <Page className={classNames(classes.SchedulePage, {}, [className])}>
            <VStack maxW>
                <h1 className={classes.title}>{`${getSearchParams()[0].value} группа`}</h1>

                <HStack maxW justify="end">
                    {isSearchFieldVisible ? (
                        <HStack maxW className={classes.searchField}>
                            <HStack maxW justify="start">
                                <Datepicker date={searchDate} setDate={setSearchDate} />
                                <Dropdown
                                    options={kafs}
                                    value={electedKaf}
                                    onChange={(e: DropdownChangeEvent) => setElectedKaf(e.value)}
                                    optionLabel="title"
                                    placeholder="Фильтр по кафедре"
                                    emptyMessage="Ничего не найдено"
                                />
                            </HStack>

                            <HStack gap="16" maxW justify="end">
                                <Button onClick={handleClearFilterDaysClick}>
                                    Сбросить фильтр
                                </Button>
                                <Button onClick={handleSearchSubmit}>Поиск</Button>
                            </HStack>
                        </HStack>
                    ) : (
                        <Button onClick={handleSearchBtnClick}>Поиск</Button>
                    )}
                </HStack>
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
                                subjects={subjects}
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
                                subjects={subjects}
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
