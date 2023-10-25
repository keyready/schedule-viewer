import { classNames } from 'shared/lib/classNames/classNames';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import classes from './Sidebar.module.scss';
import { getIsSidebarCollapsed } from '../model/selectors/SidebarSelector';

interface SidebarProps {
    className?: string;
}

export const Sidebar = memo((props: SidebarProps) => {
    const { className } = props;

    const isCollapsed = useSelector(getIsSidebarCollapsed);

    return (
        <div
            className={classNames(classes.Sidebar, { [classes.collapsed]: isCollapsed }, [
                className,
            ])}
        >
            <h2>Сайдбар</h2>
        </div>
    );
});
