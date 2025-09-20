import { useState } from 'react';
import { DateValue, parseDate } from '@internationalized/date';
import { Lectern } from '@/entities/lectern';
import { Classroom } from '@/entities/classroom';

export const useScheduleFilters = () => {
    const [lectern, setLectern] = useState<Lectern | null>(null);
    const [classroom, setClassroom] = useState<Classroom | null>(null);
    const [day, setDay] = useState<DateValue | null>(
        parseDate(new Date().toISOString().split('T')[0]),
    );

    return {
        lectern,
        day,
        classroom,
        setClassroom,
        setLectern,
        setDay,
    };
};
