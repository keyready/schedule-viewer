import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { groupScheduleKeys, scheduleApi, WeekFilterBlock } from '@/entities/schedule';
import { GroupScheduleWidget } from '@/widgets/GroupScheduleWidget';
import { MovablePageTitle } from '@/shared/ui/MovablePageTitle';

interface GroupSchedulePageProps {
    params: Promise<{ group: string }>;
}

export default async function GroupSchedulePage({ params }: GroupSchedulePageProps) {
    const { group } = await params;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: groupScheduleKeys.currentDay({ groupName: group }),
        queryFn: () => scheduleApi.getSelectedGroup({ groupName: group }),
    });

    return (
        <div className="flex h-[calc(100vh_-_60px)] flex-col gap-6 overflow-y-auto px-10">
            <MovablePageTitle>Расписание для {group.replace('-', '/')} уч. гр.</MovablePageTitle>

            <HydrationBoundary state={dehydrate(queryClient)}>
                <div className="relative flex gap-3">
                    <WeekFilterBlock groupName={group} />
                    <GroupScheduleWidget groupName={group} />
                </div>
            </HydrationBoundary>
        </div>
    );
}
