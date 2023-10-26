import { Page } from 'widgets/Page/Page';
import { useState } from 'react';
import { GroupList } from 'entities/Group';
import { FetchGroupsForm } from '../FetchGroupsForm/FetchGroupsForm';
import { Loader } from '../Loader/Loader';

const MainPage = () => {
    const [scheduleDir, setScheduleDir] = useState<string>('');
    const [isGroupsLoading, setIsGroupsLoading] = useState<boolean>(false);

    return (
        <Page>
            <FetchGroupsForm setScheduleDir={setScheduleDir} />
            {isGroupsLoading && <Loader />}
            <GroupList directory={scheduleDir} setIsGroupsLoading={setIsGroupsLoading} />
        </Page>
    );
};

export default MainPage;
