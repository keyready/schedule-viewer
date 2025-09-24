import { lecternApi, LecternsList } from '@/entities/lectern';
import { classroomApi } from '@/entities/classroom';

export default async function LecternsSettingsPage() {
    const lecterns = await lecternApi.getLecterns();
    const classrooms = await classroomApi.getClassrooms();

    return (
        <div className="flex w-full flex-col gap-4 pb-10">
            <h1 className="text-2xl font-bold">Кафедры</h1>
            <LecternsList classrooms={classrooms} lecterns={lecterns} />
        </div>
    );
}
