import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useEffect, useMemo } from 'react';
import { HStack, VStack } from 'shared/UI/Stack';
import { useDays } from 'shared/lib/hooks/useDays/useDays';
import { Disclosure } from 'shared/UI/Disclosure';
import { Subject } from 'entities/Subject';
import classes from './ScheduleDayCard.module.scss';

interface ScheduleDayCardProps {
    className?: string;
    title: string;
    jobs: string[];
    subjects: Subject[];
}

interface IDay {
    type: string;
    title: string;
    classroom: string;
}

export const ScheduleDayCard = memo((props: ScheduleDayCardProps) => {
    const { className, jobs, title, subjects } = props;

    const day = useDays(new Date(title), { isLower: true });

    const dayData = useMemo<IDay[]>(() => {
        const result: IDay[] = [];

        jobs.forEach((job) => {
            result.push({
                type: job.split(', ')[0]?.split(': ')[1] || '',
                title: job.split(', ')[1]?.split(': ')[1] || '',
                classroom: job.split(', ')[2]?.split(': ')[1] || '',
            });
        });
        return result;
    }, [jobs]);

    useEffect(() => {
        const hello = () => {
            if (subjects?.length)
                subjects?.map((sub) => console.log(sub.title));
            else console.log(subjects);
        };

        hello();
    }, [subjects]);

    return (
        <VStack
            maxW
            className={classNames(classes.ScheduleDayCard, {}, [
                className,
            ])}
        >
            <h3 className={classes.title}>
                {new Date(title).toLocaleDateString('ru-RU')}, {day}
            </h3>
            {dayData.map((day, index) => (
                <Disclosure
                    key={index}
                    title={
                        <HStack maxW justify="between">
                            <p style={{ fontWeight: 'bold' }}>
                                {day.title.toUpperCase() ||
                                    day.type.toUpperCase()}
                            </p>
                            <p style={{ fontWeight: 'bold' }}>
                                {day.classroom}
                            </p>
                        </HStack>
                    }
                    content={
                        <VStack maxW>
                            <h2 className={classes.discTitle}>
                                {subjects
                                    .filter(
                                        (sub) =>
                                            sub.abbr.toUpperCase() ===
                                            day.title.toUpperCase(),
                                    )[0]
                                    ?.title.toUpperCase()}
                            </h2>
                            <HStack maxW justify="between">
                                <p>
                                    {day.type.split('/')[0] === 'П'
                                        ? 'Практика'
                                        : 'Лекция'}
                                </p>
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
                                                sub.abbr.toUpperCase() ===
                                                day.title.toUpperCase(),
                                        )[0]?.kaf
                                    }
                                </p>
                            </HStack>
                        </VStack>
                    }
                />
            ))}
        </VStack>
    );
});
