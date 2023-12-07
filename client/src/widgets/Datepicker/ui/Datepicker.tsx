import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useCallback, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { HStack } from 'shared/UI/Stack';
import { FormEvent } from 'primereact/ts-helpers';
import { addLocale, locale } from 'primereact/api';
import classes from './Datepicker.module.scss';

interface DatepickerProps {
    className?: string;
    date: Date;
    setDate: (date: Date) => void;
    dateFormat?: string;
}

export const Datepicker = memo((props: DatepickerProps) => {
    const { className, setDate, date, dateFormat = 'dd.mm.yy D' } = props;

    useEffect(() => {
        addLocale('ru', {
            firstDayOfWeek: 1,
            dayNames: [
                'Воскресенье',
                'Понедельник',
                'Вторник',
                'Среда',
                'Четверг',
                'Пятница',
                'Суббота',
            ],
            dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            monthNames: [
                'Январь ',
                'Февраль ',
                'Март ',
                'Апрель ',
                'Май ',
                'Июнь ',
                'Июль ',
                'Август ',
                'Сентябрь ',
                'Октябрь ',
                'Ноябрь ',
                'Декабрь ',
            ],
            monthNamesShort: [
                'Янв',
                'Фев',
                'Мар',
                'Апр',
                'Май',
                'Июн',
                'Июл',
                'Авг',
                'Сен',
                'Окт',
                'Ноя',
                'Дек',
            ],
            today: 'Сег.',
            clear: 'Очистить',
        });
        locale('ru');
    }, []);

    const handleDateChange = useCallback(
        (event: FormEvent) => {
            setDate(event.value as Date);
        },
        [setDate],
    );

    return (
        <HStack maxW className={classNames(classes.Datepicker, {}, [className])}>
            <Calendar value={date} dateFormat={dateFormat} onChange={handleDateChange} />
        </HStack>
    );
});
