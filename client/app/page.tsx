import { CommonScheduleWidget } from '../src/widgets/CommonScheduleWidget';

export default function CommonSchedulePreview() {
    return (
        <div className="py-5 px-10 h-[calc(100vh_-_60px)] overflow-auto">
            <CommonScheduleWidget />
        </div>
    );
}
