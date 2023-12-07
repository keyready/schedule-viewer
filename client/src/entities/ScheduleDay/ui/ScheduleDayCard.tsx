import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useEffect, useMemo } from 'react';
import { HStack, VStack } from 'shared/UI/Stack';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useDays } from 'shared/lib/hooks/useDays/useDays';
import { Disclosure } from 'shared/UI/Disclosure';
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
                        disabled={
                            day.type.toLowerCase() === 'самоподготовка' ||
                            day.type.toLowerCase() === 'выходной день' ||
                            day.type.toLowerCase() === 'хозяйственный день' ||
                            day.type.toLowerCase() === 'отп'
                        }
                        key={index}
                        header={
                            <HStack
                                className={classNames('', {
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
                                <p style={{ fontWeight: 'bold' }}>
                                    {day.title.toUpperCase() || day.type.toUpperCase()}
                                </p>
                                <p style={{ fontWeight: 'bold' }}>{day.classroom}</p>
                            </HStack>
                        }
                    >
                        <VStack maxW>
                            <h2 className={classes.discTitle}>
                                {subjects
                                    .filter(
                                        (sub) => sub.abbr.toUpperCase() === day.title.toUpperCase(),
                                    )[0]
                                    ?.title.toUpperCase()}
                            </h2>
                            <HStack maxW justify="between">
                                <p>{day.type.split('/')[0] === 'П' ? 'Практика' : 'Лекция'}</p>
                                <p>{day.type.split('/')[1]}</p>
                            </HStack>
                            <HStack maxW justify="between">
                                <p>Преподаватель</p>
                                <p>
                                    {
                                        subjects
                                            .filter(
                                                (sub) =>
                                                    sub.abbr.toUpperCase() ===
                                                    day.title.toUpperCase(),
                                            )[0]
                                            ?.prepod?.split('; ')[0]
                                    }
                                </p>
                            </HStack>
                            <HStack maxW justify="between">
                                <p>Кафедра</p>
                                <p>
                                    {
                                        subjects.filter(
                                            (sub) =>
                                                sub.abbr.toUpperCase() === day.title.toUpperCase(),
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
