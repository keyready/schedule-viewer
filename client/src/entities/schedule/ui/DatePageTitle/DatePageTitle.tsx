'use client';

import { type DateValue, parseDate } from '@internationalized/date';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { addDays, differenceInDays } from 'date-fns';
import { useDays } from '@/shared/lib';

interface DatePageTitleProps {
    viewedDay: DateValue | null;
    setViewedDay: Dispatch<SetStateAction<DateValue | null>>;
}

export const DatePageTitle = (props: DatePageTitleProps) => {
    const { setViewedDay, viewedDay } = props;

    const day = useDays(new Date(viewedDay?.toString() || ''), { isLower: true });

    const getDayDifferenceLetters = useMemo(() => {
        const daysDifference = differenceInDays(
            new Date().setHours(0, 0, 0, 0),
            new Date(viewedDay?.toString() || '').setHours(0, 0, 0, 0),
        );
        if (daysDifference === 0) return 'Сегодня';
        if (daysDifference === -1) return 'Завтра';
        if (daysDifference === 1) return 'Вчера';
        if (daysDifference === -2) return 'Послезавтра';
        if (daysDifference === 2) return 'Позавчера';
        return undefined;
    }, [viewedDay]);

    return (
        <div className="my-5 flex w-full items-center justify-center gap-4 text-4xl font-bold">
            <button
                type="button"
                onClick={() => {
                    setViewedDay((pv) =>
                        parseDate(
                            addDays(new Date(pv?.toString() || ''), -1)
                                .toISOString()
                                .split('T')[0],
                        ),
                    );
                }}
                className="h-10 w-10 rounded bg-blue-200/50 p-2 text-xl duration-200 hover:bg-blue-200"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    {/* eslint-disable-next-line max-len */}
                    <path d="M4.83582 12L11.0429 18.2071L12.4571 16.7929L7.66424 12L12.4571 7.20712L11.0429 5.79291L4.83582 12ZM10.4857 12L16.6928 18.2071L18.107 16.7929L13.3141 12L18.107 7.20712L16.6928 5.79291L10.4857 12Z" />
                </svg>
            </button>
            <div className="jutify-center flex flex-col items-center">
                <h1>
                    {getDayDifferenceLetters}{' '}
                    {new Date(viewedDay?.toString() || '').toLocaleDateString('ru-RU')}, {day}
                </h1>
                {new Date(viewedDay?.toString() || '').toDateString() !==
                    new Date().toDateString() && (
                    <button
                        type="button"
                        onClick={() => {
                            setViewedDay(parseDate(new Date().toISOString().split('T')[0]));
                        }}
                        className="text-xs font-normal hover:underline"
                    >
                        Показать сегодня
                    </button>
                )}
            </div>
            <button
                type="button"
                onClick={() => {
                    setViewedDay((pv) =>
                        parseDate(
                            addDays(new Date(pv?.toString() || ''), 1)
                                .toISOString()
                                .split('T')[0],
                        ),
                    );
                }}
                className="h-10 w-10 rounded bg-blue-200/50 p-2 text-xl duration-200 hover:bg-blue-200"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    {/* eslint-disable-next-line max-len */}
                    <path d="M19.1642 12L12.9571 5.79291L11.5429 7.20712L16.3358 12L11.5429 16.7929L12.9571 18.2071L19.1642 12ZM13.5143 12L7.30722 5.79291L5.89301 7.20712L10.6859 12L5.89301 16.7929L7.30722 18.2071L13.5143 12Z" />
                </svg>
            </button>
        </div>
    );
};
