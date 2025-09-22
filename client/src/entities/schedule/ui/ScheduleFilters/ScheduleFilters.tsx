'use client';

import { DatePicker } from '@heroui/date-picker';
import { I18nProvider } from '@react-aria/i18n';
import type { DateValue } from '@internationalized/date';
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import { Dispatch, Key, SetStateAction, useCallback } from 'react';
import { type Lectern, useLecterns } from '@/entities/lectern';
import { type Classroom, useClassrooms } from '@/entities/classroom';

interface ScheduleFiltersProps {
    day: DateValue | null;
    onDayChange: (value: DateValue | null) => void;
    setSelectedLectern: Dispatch<SetStateAction<Lectern | null>>;
    setSelectedClassroom: Dispatch<SetStateAction<Classroom | null>>;
    selectedLectern: Lectern | null;
    selectedClassroom: Classroom | null;
}

export const ScheduleFilters = (props: ScheduleFiltersProps) => {
    const {
        day,
        onDayChange,
        selectedClassroom,
        setSelectedClassroom,
        setSelectedLectern,
        selectedLectern,
    } = props;

    const { data: lecterns, isLoading: isLecternsLoading } = useLecterns();
    const { data: classrooms, isLoading: isClassroomsLoading } = useClassrooms();

    const handleSelectedLecternChange = useCallback(
        (key: Key | null) => {
            if (!lecterns) return;
            setSelectedLectern(lecterns.filter((k) => k._id === key)[0]);
        },
        [lecterns, setSelectedLectern],
    );

    const handleSelectedClassroomChange = useCallback(
        (key: Key | null) => {
            if (!classrooms) return;
            setSelectedClassroom(classrooms.filter((k) => k._id === key)[0]);
        },
        [classrooms, setSelectedClassroom],
    );

    return (
        <div className="p-5 pt-0 max-w-64 top-0 flex-[1_0_auto] sticky h-fit">
            <h1 className="text-xl pb-3 font-bold">Фильтры</h1>

            <div className="flex flex-col gap-2">
                <Autocomplete
                    selectedKey={selectedLectern?._id}
                    onSelectionChange={handleSelectedLecternChange}
                    size="sm"
                    isLoading={isLecternsLoading}
                    defaultItems={lecterns || []}
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
                        label="Дата"
                        hideTimeZone
                        value={day}
                        onChange={onDayChange}
                        visibleMonths={1}
                    />
                </I18nProvider>
            </div>
        </div>
    );
};
