import { classNames } from 'shared/lib/classNames/classNames';
import { memo } from 'react';
import { ScheduleDay, ScheduleDayCard } from 'entities/ScheduleDay';
import { VStack } from 'shared/UI/Stack';
import { useSubjects } from 'entities/Subject';
import classes from './CurrentDayGroupCard.module.scss';
import { Loader } from '@/shared/UI/Loader';

interface CurrentDayGroupCardProps {
    className?: string;
    group: ScheduleDay;
    onClick?: () => void;
}

export const CurrentDayGroupCard = memo((props: CurrentDayGroupCardProps) => {
    const { className, group, onClick } = props;

    const { data: subjects, isLoading: isSubjectsLoading } = useSubjects(group.groupName || '');

    if (isSubjectsLoading) return <Loader />;

    return (
        <VStack
            onClick={onClick}
            maxW
            className={classNames(classes.CurrentDayGroupCard, {}, [className])}
        >
            <ScheduleDayCard
                title={group.date?.toLocaleString() || ''}
                jobs={group.jobs}
                subjects={subjects || []}
                type="group"
                groupName={group.groupName}
            />
        </VStack>
    );
});
