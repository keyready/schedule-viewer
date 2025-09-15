import { classNames } from 'shared/lib/classNames/classNames';
import { memo } from 'react';
import { HStack } from 'shared/UI/Stack';
import { AppLink } from 'shared/UI/AppLink';
import { RoutePath } from 'shared/config/routeConfig/routeConfig';
import classes from './Navbar.module.scss';

export interface NavbarProps {
    className?: string;
}

export const Navbar = memo(({ className }: NavbarProps) => (
    <HStack maxW align="center" className={classNames(classes.Navbar, {}, [className])}>
        <HStack maxW justify="between" gap="32">
            <AppLink to={RoutePath.todayview}>
                <h3>Расписание на сегодня</h3>
            </AppLink>
            <HStack>
                <AppLink to={RoutePath.main}>
                    <h4>Список групп</h4>
                </AppLink>
                <AppLink to={RoutePath.managekafs}>
                    <h4>Управление</h4>
                </AppLink>
            </HStack>
        </HStack>
    </HStack>
));
