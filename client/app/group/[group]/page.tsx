import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { groupScheduleKeys, scheduleApi, WeekFilterBlock } from '@/entities/schedule';
import { GroupScheduleWidget } from '@/widgets/GroupScheduleWidget';

export default async function GroupSchedulePage({ params }: { params: { group: string } }) {
    const { group } = await params;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: groupScheduleKeys.currentDay({ groupName: group }),
        queryFn: () => scheduleApi.getSelectedGroup({ groupName: group }),
    });

    return (
        <div className="flex h-[calc(100vh_-_60px)] flex-col gap-6 overflow-y-auto px-10">
            <div className="mt-5 flex w-full items-center justify-center">
                <h1 className="w-full text-center text-4xl font-bold">
                    Расписание для {group.replace('-', '/')} уч. гр.
                </h1>
            </div>

            <HydrationBoundary state={dehydrate(queryClient)}>
                <div className="relative flex gap-3">
                    <WeekFilterBlock groupName={group} />
                    <GroupScheduleWidget groupName={group} />
                </div>
            </HydrationBoundary>
        </div>
    );
}
