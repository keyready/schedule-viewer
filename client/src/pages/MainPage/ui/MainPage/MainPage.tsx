import { Page } from 'widgets/Page/Page';
import { useState } from 'react';
import { GroupList } from 'entities/Group';
import { VStack } from 'shared/UI/Stack';
import { FetchGroupsForm } from '../FetchGroupsForm/FetchGroupsForm';
import { Loader } from '../Loader/Loader';
import classes from './MainPage.module.scss';

const MainPage = () => {
    const [scheduleDir, setScheduleDir] = useState<string>('');
    const [isGroupsLoading, setIsGroupsLoading] = useState<boolean>(false);

    return (
        <Page>
            <FetchGroupsForm setScheduleDir={setScheduleDir} />
            {isGroupsLoading && <Loader />}
            <VStack className={classes.content} maxW align="center" justify="center">
                <GroupList directory={scheduleDir} setIsGroupsLoading={setIsGroupsLoading} />
            </VStack>
        </Page>
    );
};

export default MainPage;
