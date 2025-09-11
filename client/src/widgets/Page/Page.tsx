import { classNames } from 'shared/lib/classNames/classNames';
import { memo, ReactNode } from 'react';
import classes from './Page.module.scss';

interface PageProps {
    className?: string;
    children?: ReactNode;
    onScrollEnd?: () => void;
}

export const Page = memo((props: PageProps) => {
    const { className, children } = props;

    return <section className={classNames(classes.Page, {}, [className])}>{children}</section>;
});
