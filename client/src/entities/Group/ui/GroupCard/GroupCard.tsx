import { classNames } from 'shared/lib/classNames/classNames';
import { memo } from 'react';
import classes from './GroupCard.module.scss';

interface GroupCardProps {
    className?: string;
    group: string;
}

export const GroupCard = memo((props: GroupCardProps) => {
    const { className, group } = props;

    return (
        <div className={classNames(classes.GroupCard, {}, [className])}>
            <p>
                <b>{group}</b> учебная группа
            </p>
        </div>
    );
});
