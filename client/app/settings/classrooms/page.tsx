import { classroomApi, ClassroomsList } from '@/entities/classroom';
import { lecternApi } from '@/entities/lectern';

export const dynamic = 'force-dynamic';

export default async function ClassroomsSettingsPage() {
    const classrooms = await classroomApi.getClassrooms();
    const lecterns = await lecternApi.getLecterns();

    return (
        <div className="flex w-full flex-col gap-7">
            <h1 className="text-2xl font-bold">Аудитории</h1>
            <ClassroomsList classrooms={classrooms} lecterns={lecterns} />
        </div>
    );
}
