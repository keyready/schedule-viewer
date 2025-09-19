import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useCallback, useMemo } from 'react';
import { HStack, VStack } from 'shared/UI/Stack';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useDays } from 'shared/lib/hooks/useDays/useDays';
import { Subject } from 'entities/Subject';
import classes from './ScheduleDayCard.module.scss';

interface ScheduleDayCardProps {
    className?: string;
    title: string;
    jobs: string[];
    subjects: Subject[];
    type?: 'group' | 'day';
    groupName?: string;
}

interface IDay {
    type: string;
    title: string;
    classroom: string;
}

export const ScheduleDayCard = memo((props: ScheduleDayCardProps) => {
    const { className, jobs, title, subjects, type = 'day', groupName } = props;

    const day = useDays(new Date(title), { isLower: true });

    const dayData = useMemo<IDay[]>(() => {
        const result: IDay[] = [];

        if (!jobs?.length) return [];

        jobs.forEach((job) => {
            result.push({
                type:
                    job.split(', ')[0]?.split(': ')[1] || job.split(', ')[0]?.split(': ')[0] || '',
                title: job.split(', ')[1]?.split(': ')[1] || '',
                classroom: job.split(', ')[2]?.split(': ')[1] || '',
            });
        });
        return result;
    }, [jobs]);

    const isCellDisabled = useCallback((dayType: string, dayTitle: string) => {
        return [
            'самоподготовка',
            'выходной день',
            'хозяйственный день',
            'отп',
            'ср',
            'умо',
            'вых',
            'оп',
            'тсу',
            'стаж',
        ].includes(dayType.toLowerCase() || dayTitle.toLowerCase());
    }, []);

    return (
        <VStack
            maxW
            className={classNames(
                classes.ScheduleDayCard,
                { [classes.clickable]: type === 'group' },
                [className],
            )}
        >
            <h3 className={classes.title}>
                {type === 'day'
                    ? `${new Date(title).toLocaleDateString('ru-RU')}, ${day}`
                    : `${groupName} учебная группа`}
            </h3>

            <Accordion onClick={(event) => event.stopPropagation()}>
                {dayData.map((day, index) => (
                    <AccordionTab
                        disabled={isCellDisabled(day.type, day.title)}
                        key={index}
                        header={
                            <HStack
                                className={classNames('!p-3', {
                                    [classes.exam]:
                                        day.type.split('/')[0] === 'Э' ||
                                        day.type.split('/')[0] === 'ИКС' ||
                                        day.type.split('/')[0] === 'КУР' ||
                                        day.type.split('/')[0] === 'КуР' ||
                                        day.type.split('/')[0] === 'ЗО',
                                })}
                                maxW
                                justify="between"
                            >
                                <p className="text-bold">
                                    {day.title?.toUpperCase() || day.type?.toUpperCase()}
                                </p>
                                <p className="text-bold">{day.classroom}</p>
                            </HStack>
                        }
                    >
                        <VStack maxW className="px-4">
                            <h2 className={classes.discTitle}>
                                {subjects
                                    .filter(
                                        (sub) =>
                                            sub.abbr?.toUpperCase() === day.title?.toUpperCase(),
                                    )[0]
                                    ?.title?.toUpperCase()}
                            </h2>
                            <HStack maxW justify="between">
                                <p className="text-xs">
                                    {day.type.split('/')[0] === 'П' ? 'Практика' : 'Лекция'}
                                </p>
                                <p className="text-xs">{day.type.split('/')[1]}</p>
                            </HStack>
                            <HStack maxW justify="between">
                                <p className="text-xs">Преподаватель</p>
                                <p className="text-xs">
                                    {
                                        subjects
                                            .filter(
                                                (sub) =>
                                                    sub.abbr?.toUpperCase() ===
                                                    day.title?.toUpperCase(),
                                            )[0]
                                            ?.prepod?.split('; ')[0]
                                    }
                                </p>
                            </HStack>
                            <HStack maxW justify="between">
                                <p className="text-xs">Кафедра</p>
                                <p className="text-xs">
                                    {
                                        subjects.filter(
                                            (sub) =>
                                                sub.abbr?.toUpperCase() ===
                                                day.title?.toUpperCase(),
                                        )[0]?.kaf
                                    }
                                </p>
                            </HStack>
                        </VStack>
                    </AccordionTab>
                ))}
            </Accordion>
        </VStack>
    );
});
