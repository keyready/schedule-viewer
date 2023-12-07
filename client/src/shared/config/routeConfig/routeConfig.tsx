import { RouteProps } from 'react-router-dom';
import { MainPage } from 'pages/MainPage';
import { SchedulePage } from 'pages/SchedulePage';
import { NotFound } from 'pages/common/NotFound';
import { TodayViewPage } from 'pages/TodayViewPage';

export type AppRoutesProps = RouteProps & {
    authOnly?: boolean;
};

export enum AppRoutes {
    MAIN = 'main',
    SCHEDULE = 'schedule',
    TODAYVIEW = 'todayview',

    // last
    NOT_FOUND = 'not_found',
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.TODAYVIEW]: '/',
    [AppRoutes.MAIN]: '/groups-list',
    [AppRoutes.SCHEDULE]: '/group-schedule',

    // last
    [AppRoutes.NOT_FOUND]: '*',
};

export const routerConfig: Record<AppRoutes, AppRoutesProps> = {
    [AppRoutes.MAIN]: {
        path: RoutePath.main,
        element: <MainPage />,
    },
    [AppRoutes.SCHEDULE]: {
        path: RoutePath.schedule,
        element: <SchedulePage />,
    },
    [AppRoutes.TODAYVIEW]: {
        path: RoutePath.todayview,
        element: <TodayViewPage />,
    },

    // last
    [AppRoutes.NOT_FOUND]: {
        path: RoutePath.not_found,
        element: <NotFound />,
    },
};
