import { CommonScheduleWidget } from '../src/widgets/CommonScheduleWidget';
import { Page } from '@/shared/ui/Page';

export default function CommonSchedulePreview() {
    return (
        <Page className="block py-5">
            <CommonScheduleWidget />
        </Page>
    );
}
