import { Skeleton } from 'primereact/skeleton';

export const ScheduleGridLoading = () => {
    return (
        <div className="w-full">
            {new Array(3).fill(0).map((_, index) => (
                <div key={index} className="flex flex-col gap-4">
                    <Skeleton width="33%" height="50px" />
                    <div className="grid gap-4 grid-cols-3">
                        {new Array(5).fill(0).map((_, index) => (
                            <Skeleton key={index} width="100%" height="220px" />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
