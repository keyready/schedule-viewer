import { classNames } from 'shared/lib/classNames/classNames';
import { memo } from 'react';
import { HStack } from 'shared/UI/Stack';
import classes from './Navbar.module.scss';

export interface NavbarProps {
    className?: string;
}

export const Navbar = memo(({ className }: NavbarProps) => (
    <HStack maxW align="center" className={classNames(classes.Navbar, {}, [className])}>
        <HStack maxW justify="center">
            <h2>Расписание занятий курсантов 6 факультета</h2>
        </HStack>
    </HStack>
));
