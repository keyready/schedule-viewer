import { AnchorLink } from '@/shared/lib/hooks/useScrollSpy';
import { classNames } from '@/shared/lib/classNames/classNames';
import type { GroupedSchedule } from 'entities/ScheduleDay';
import { Autocomplete, AutocompleteItem, DatePicker } from '@heroui/react';
import { IKaf, useAuds, useKafs } from 'pages/SchedulePage';
import { Dispatch, Key, SetStateAction, useCallback } from 'react';
import { I18nProvider } from '@react-aria/i18n';
import { isSunday } from 'date-fns';
import { DateValue } from '@internationalized/date';

interface PageNavigateProps {
    currentSchedule: GroupedSchedule | [];
    activeCourse: string | null;
    selectedKaf: IKaf | undefined;
    setSelectedKaf: Dispatch<SetStateAction<IKaf | undefined>>;
    selectedClassroom: IKaf | undefined;
    setSelectedClassroom: Dispatch<SetStateAction<IKaf | undefined>>;
    selectedDate: DateValue | null;
    setSelectedDate: Dispatch<SetStateAction<DateValue | null>>;
}

export const PageNavigation = (props: PageNavigateProps) => {
    const {
        currentSchedule,
        activeCourse,
        selectedKaf,
        setSelectedKaf,
        selectedClassroom,
        setSelectedClassroom,
        selectedDate,
        setSelectedDate,
    } = props;

    const { data: kafedras, isLoading: isKafsLoading } = useKafs();
    const { data: classrooms, isLoading: isClassroomsLoading } = useAuds();

    const isDateUnavailable = useCallback((date: Date) => {
        return isSunday(date);
    }, []);

    const handleSelectedKafChange = useCallback(
        (key: Key | null) => {
            if (!kafedras) return;
            setSelectedKaf(kafedras.filter((k) => k._id === key)[0]);
        },
        [kafedras, setSelectedKaf],
    );

    const handleSelectedClassroomChange = useCallback(
        (key: Key | null) => {
            if (!classrooms) return;
            setSelectedClassroom(classrooms.filter((k) => k._id === key)[0]);
        },
        [classrooms, setSelectedClassroom],
    );

    return (
        <div className="w-80 h-fit flex flex-col gap-6 top-0 sticky">
            <div className="flex flex-col">
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

            <div className="flex flex-col">
                <h1 className="text-xl pb-3 font-bold">Фильтры</h1>
                <div className="flex flex-col gap-2">
                    <Autocomplete
                        selectedKey={selectedKaf?._id}
                        onSelectionChange={handleSelectedKafChange}
                        size="sm"
                        isLoading={isKafsLoading}
                        defaultItems={kafedras || []}
                        label="Кафедра"
                    >
                        {(item) => <AutocompleteItem key={item._id}>{item.title}</AutocompleteItem>}
                    </Autocomplete>

                    <Autocomplete
                        selectedKey={selectedClassroom?._id}
                        onSelectionChange={handleSelectedClassroomChange}
                        size="sm"
                        isLoading={isClassroomsLoading}
                        defaultItems={classrooms || []}
                        label="Аудитория"
                    >
                        {(item) => <AutocompleteItem key={item._id}>{item.title}</AutocompleteItem>}
                    </Autocomplete>

                    <I18nProvider locale="ru-RU">
                        <DatePicker
                            // @ts-expect-error bullshit
                            isDateUnavailable={isDateUnavailable}
                            label="Дата"
                            hideTimeZone
                            value={selectedDate}
                            onChange={setSelectedDate}
                            visibleMonths={2}
                        />
                    </I18nProvider>
                </div>
            </div>
        </div>
    );
};
