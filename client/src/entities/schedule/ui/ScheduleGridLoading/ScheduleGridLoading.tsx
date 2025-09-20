import { Skeleton } from '@heroui/skeleton';

export const ScheduleGridLoading = () => (
    <div className="w-full">
        {new Array(3).fill(0).map((_, index) => (
            <div key={index} className="flex flex-col gap-4">
                <Skeleton className="w-1/3 h-[50px] rounded-xl" />
                <div className="grid gap-4 grid-cols-3">
                    {new Array(5).fill(0).map((_, index) => (
                        <Skeleton key={index} className="w-full h-[220px] rounded-xl" />
                    ))}
                </div>
            </div>
        ))}
    </div>
);
