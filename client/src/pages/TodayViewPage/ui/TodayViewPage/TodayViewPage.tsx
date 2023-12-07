import { classNames } from 'shared/lib/classNames/classNames';
import { Page } from 'widgets/Page/Page';
import { memo, useEffect } from 'react';
import classes from './TodayViewPage.module.scss';

interface TodayViewPageProps {
    className?: string;
}

const TodayViewPage = memo((props: TodayViewPageProps) => {
    const { className } = props;

    useEffect(() => {
        document.title = 'Сегодня';
    }, []);

    useEffect(() => {
        fetch('http://localhost:5000/api/today').then((res) => res.json());
    }, []);

    return (
        <Page className={classNames(classes.TodayViewPage, {}, [className])}>
            <h1>привет</h1>
        </Page>
    );
});

export default TodayViewPage;
