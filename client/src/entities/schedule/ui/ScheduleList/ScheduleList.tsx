'use client';

import { useCallback } from 'react';
import Image from 'next/image';
import { DayScheduleCard } from '../DayScheduleCard/DayScheduleCard';
import { GroupedSchedule, ScheduleGroupDay } from '../../model/types/schedule';
import { Classroom } from '@/entities/classroom';
import { Lectern } from '@/entities/lectern';
import GlassesSmirk from '@/shared/assets/svg/glasses-smirk.svg';
import CrySmile from '@/shared/assets/svg/cry-smile.svg';
import FruzzledSmile from '@/shared/assets/svg/fruzzled-smile.svg';
import HungrySmile from '@/shared/assets/svg/hungry-smile.svg';

interface ScheduleListProps {
    schedule: GroupedSchedule;
    classroom: Classroom | null;
    lectern: Lectern | null;
}

export const ScheduleList = ({ schedule, lectern, classroom }: ScheduleListProps) => {
    const filterClassrooms = useCallback(
        (group: ScheduleGroupDay) => {
            if (!classroom?.title && !lectern?.title) {
                return true;
            }

            const lecternKaf = lectern?.title?.split(' | ')[0];
            const classroomTitle = classroom?.title;

            const matchesLectern = !lecternKaf || group.lectern === lecternKaf;

            const matchesClassroom =
                !classroomTitle ||
                group.jobs.some(
                    (job) =>
                        job.includes('аудитория: ') &&
                        job.split('аудитория: ')[1] === classroomTitle,
                );

            return matchesLectern && matchesClassroom;
        },
        [classroom?.title, lectern?.title],
    );

    const filteredGroups = useCallback(
        (groups: ScheduleGroupDay[]) => groups.filter(filterClassrooms),
        [filterClassrooms],
    );

    const renderCourseSmile = useCallback((course: string) => {
        switch (course) {
            case '65': {
                return <Image src={GlassesSmirk} width={40} height={40} alt="65 курс" />;
            }
            case '64': {
                return <Image src={HungrySmile} width={40} height={40} alt="64 курс" />;
            }
            case '63': {
                return <Image src={FruzzledSmile} width={40} height={40} alt="63 курс" />;
            }
            default: {
                return <Image src={CrySmile} width={40} height={40} alt="62 курс" />;
            }
        }
    }, []);

    return (
        <div className="w-full flex flex-col gap-10">
            {Object.entries(schedule)
                .reverse()
                .map(([course, days]) => (
                    <div key={course} className="flex flex-col gap-4">
                        <h3 className="text-3xl flex items-center gap-4 font-semibold mb-2">
                            {renderCourseSmile(course)}
                            {course} курс
                        </h3>

                        <div className="w-full grid grid-cols-3 gap-3">
                            {filteredGroups(days).length ? (
                                filteredGroups(days).map((day, index) => (
                                    <DayScheduleCard day={day} key={index} />
                                ))
                            ) : (
                                <div className="col-span-3 ml-10 text-red-800 text-xl">
                                    На этом курсе нет занятий в выбранной аудитории
                                </div>
                            )}
                        </div>
                    </div>
                ))}
        </div>
    );
};
