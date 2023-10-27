import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useEffect } from 'react';
import { GroupCard } from '../GroupCard/GroupCard';
import classes from './GroupList.module.scss';
import { useGroups } from '../../api/fetchGroupsApi';

interface GroupListProps {
    className?: string;
    setIsGroupsLoading: (flag: boolean) => void;
    directory: string;
}

export const GroupList = memo((props: GroupListProps) => {
    const { className, setIsGroupsLoading, directory } = props;

    const { data: groups, isLoading, error } = useGroups(directory);

    useEffect(() => {
        setIsGroupsLoading(isLoading);
    }, [isLoading, setIsGroupsLoading, groups]);

    if (error) {
        return (
            <div>
                <h2>Ничего не найдено</h2>
            </div>
        );
    }

    return (
        <div
            className={classNames(classes.GroupList, {}, [className])}
        >
            {groups?.length &&
                groups.map((group) => <GroupCard group={group} />)}
        </div>
    );
});
