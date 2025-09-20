import { ScheduleWidget } from '@/widgets/schedule';

export default function CommonSchedulePreview() {
    return (
        <div className="py-5 px-10 h-screen overflow-auto">
            <ScheduleWidget />
        </div>
    );
}
