import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { groupScheduleKeys, scheduleApi, WeekFilterBlock } from '@/entities/schedule';
import { GroupScheduleWidget } from '@/widgets/GroupScheduleWidget';

export default async function GroupSchedulePage({ params }: { params: { group: string } }) {
    const { group } = params;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: groupScheduleKeys.currentDay({ groupName: group }),
        queryFn: () => scheduleApi.getSelectedGroup({ groupName: group }),
    });

    return (
        <div className="px-10 flex gap-6 h-[calc(100vh_-_60px)] flex-col overflow-y-auto">
            <div className="mt-5 flex justify-center items-center w-full">
                <h1 className="text-center w-full text-4xl font-bold">
                    Расписание для {group.replace('-', '/')} уч. гр.
                </h1>
            </div>

            <HydrationBoundary state={dehydrate(queryClient)}>
                <div className="flex gap-3 relative">
                    <WeekFilterBlock groupName={group} />
                    <GroupScheduleWidget groupName={group} />
                </div>
            </HydrationBoundary>
        </div>
    );
}
