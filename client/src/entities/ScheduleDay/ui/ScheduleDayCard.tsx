import { classNames } from 'shared/lib/classNames/classNames';
import { memo, ReactNode } from 'react';
import { VStack } from 'shared/UI/Stack';
import { useDays } from 'shared/lib/hooks/useDays/useDays';
import classes from './ScheduleDayCard.module.scss';

interface ScheduleDayCardProps {
    className?: string;
    title: Date;
    children: ReactNode;
}

export const ScheduleDayCard = memo((props: ScheduleDayCardProps) => {
    const { className, children, title } = props;

    const day = useDays(new Date(title), { isLower: true });

    return (
        <div className={classNames(classes.ScheduleDayCard, {}, [className])}>
            <VStack maxW>
                <h3>
                    {new Date(title).toLocaleDateString('ru-RU')}, {day}
                </h3>
                {children}
            </VStack>
        </div>
    );
});
