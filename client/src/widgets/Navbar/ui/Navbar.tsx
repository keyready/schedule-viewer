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
        <HStack maxW justify="center">
            <AppLink to={RoutePath.main}>
                <h2>Расписание занятий 6 факультета</h2>
            </AppLink>
        </HStack>
    </HStack>
));
