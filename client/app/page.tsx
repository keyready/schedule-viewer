import { CommonScheduleWidget } from '../src/widgets/CommonScheduleWidget';

export default function CommonSchedulePreview() {
    return (
        <div className="h-[calc(100vh_-_60px)] overflow-auto px-10 py-5">
            <CommonScheduleWidget />
        </div>
    );
}
