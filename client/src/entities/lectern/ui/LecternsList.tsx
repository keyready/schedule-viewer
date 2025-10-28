'use client';

import { Lectern } from '../model/types/lectern';
import { Classroom } from '@/entities/classroom';
import { LecternBlock } from '@/entities/lectern/ui/LecternBlock';
import { CreateLecternModal } from '@/entities/lectern/ui/CreateLecternModal';
import { generateSafeId } from '@/shared/lib';

export const LecternsList = (props: { lecterns: Lectern[]; classrooms: Classroom[] }) => {
    const { lecterns, classrooms } = props;

    if (!lecterns?.length)
        return (
            <h3 className="text-danger text-lg italic opacity-60">
                Вы пока не добавили ни одной кафедры
            </h3>
        );

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6">
                {lecterns.map((lectern) => (
                    <LecternBlock
                        classrooms={classrooms}
                        lectern={lectern}
                        key={generateSafeId('lectern')}
                    />
                ))}
            </div>

            <CreateLecternModal />
        </div>
    );
};
