import { classNames } from 'shared/lib/classNames/classNames';
import { memo } from 'react';
import { RoutePath } from 'shared/config/routeConfig/routeConfig';
import { useNavigate } from 'react-router-dom';
import classes from './GroupCard.module.scss';

interface GroupCardProps {
    className?: string;
    group: string;
}

export const GroupCard = memo((props: GroupCardProps) => {
    const { className, group } = props;

    const navigate = useNavigate();

    return (
        <div
            onClick={() =>
                navigate(`${RoutePath.schedule}?group=${group}`)
            }
            className={classNames(classes.GroupCard, {}, [className])}
        >
            <p>
                <b>{group}</b> учебная группа
            </p>
        </div>
    );
});
