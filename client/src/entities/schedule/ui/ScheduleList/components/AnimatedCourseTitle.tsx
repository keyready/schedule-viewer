import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedCourseTitleProps {
    course: string;
    courseIndex: number;
    renderCourseSmile: (course: string) => ReactNode;
}

export const AnimatedCourseTitle = ({
    course,
    courseIndex,
    renderCourseSmile,
}: AnimatedCourseTitleProps) => (
    <motion.h3
        className="mb-2 flex items-center gap-4 text-3xl font-semibold"
        initial={{ opacity: 0, x: -20 }}
        animate={{
            opacity: 1,
            x: 0,
            transition: {
                delay: courseIndex * 0.2 + 0.1,
                duration: 0.2,
                ease: 'easeOut',
            },
        }}
    >
        {renderCourseSmile(course)}
        {course} курс
    </motion.h3>
);
