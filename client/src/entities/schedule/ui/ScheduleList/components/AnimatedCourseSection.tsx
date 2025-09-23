import { AnimatePresence, motion } from 'framer-motion';

import type { ScheduleGroupDay } from '../../../model/types/schedule';
import { AnimatedScheduleCard } from './AnimatedScheduleCard';
import { AnimatedCourseTitle } from './AnimatedCourseTitle';
import { AnimatedNoScheduleMessage } from './AnimatedNoScheduleMessage';
import { ReactNode } from 'react';

interface AnimatedCourseSectionProps {
    course: string;
    courseIndex: number;
    filteredGroups: ScheduleGroupDay[];
    renderCourseSmile: (course: string) => ReactNode;
}

export const AnimatedCourseSection = ({
    course,
    courseIndex,
    filteredGroups,
    renderCourseSmile,
}: AnimatedCourseSectionProps) => (
    <motion.div
        key={course}
        className="flex flex-col gap-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{
            opacity: 1,
            y: 0,
            transition: {
                delay: courseIndex * 0.2,
                duration: 0.6,
                ease: 'easeOut',
            },
        }}
        exit={{
            opacity: 0,
            y: -30,
            transition: {
                duration: 0.4,
                ease: 'easeIn',
            },
        }}
    >
        <AnimatedCourseTitle
            course={course}
            courseIndex={courseIndex}
            renderCourseSmile={renderCourseSmile}
        />

        <div className="grid w-full grid-cols-3 gap-3">
            <AnimatePresence mode="wait">
                {filteredGroups.length ? (
                    filteredGroups.map((day, index) => (
                        <AnimatedScheduleCard
                            key={`${course}-${day.date}-${index}`}
                            day={day}
                            index={index}
                            course={course}
                        />
                    ))
                ) : (
                    <AnimatedNoScheduleMessage />
                )}
            </AnimatePresence>
        </div>
    </motion.div>
);
