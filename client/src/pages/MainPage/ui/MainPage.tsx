import { Page } from 'widgets/Page/Page';
import { getIsSidebarCollapsed, SidebarActions } from 'widgets/Sidebar';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useSelector } from 'react-redux';

const MainPage = () => {
    const dispatch = useAppDispatch();

    const isCollapsed = useSelector(getIsSidebarCollapsed);

    return (
        <Page>
            <h1>Шаблон проекта</h1>
            <button
                type="button"
                onClick={() => dispatch(SidebarActions.setCollapsed(!isCollapsed))}
            >
                Переключить
            </button>
        </Page>
    );
};

export default MainPage;
