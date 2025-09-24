'use client';

import { Lectern } from '@/entities/lectern';

import { Classroom } from '../model/types/classroom';
import { CreateClassroomModal } from './CreateClassroomModal';
import { ClassroomCard } from './ClassroomCard';

export const ClassroomsList = (props: { lecterns: Lectern[]; classrooms: Classroom[] }) => {
    const { classrooms, lecterns } = props;

    if (!classrooms?.length)
        return (
            <h3 className="text-danger text-lg italic opacity-60">
                Вы пока не добавили ни одной аудитории
            </h3>
        );

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-5 gap-3">
                {classrooms.map((classroom) => (
                    <ClassroomCard key={crypto.randomUUID()} classroom={classroom} />
                ))}
            </div>
            <CreateClassroomModal lecterns={lecterns} />
        </div>
    );
};
