import { motion } from 'framer-motion';

interface AnimatedCourseTitleProps {
    course: string;
    courseIndex: number;
    renderCourseSmile: (course: string) => React.ReactNode;
}

export const AnimatedCourseTitle = ({
    course,
    courseIndex,
    renderCourseSmile,
}: AnimatedCourseTitleProps) => (
    <motion.h3
        className="text-3xl flex items-center gap-4 font-semibold mb-2"
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
