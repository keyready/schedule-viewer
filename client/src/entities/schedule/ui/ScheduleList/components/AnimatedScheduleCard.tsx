import { motion } from 'framer-motion';
import { DayScheduleCard } from '../../DayScheduleCard/DayScheduleCard';
import { ScheduleGroupDay } from '../../../model/types/schedule';

interface AnimatedScheduleCardProps {
    day: ScheduleGroupDay;
    index: number;
    course: string;
}

export const AnimatedScheduleCard = ({ day, index, course }: AnimatedScheduleCardProps) => (
    <motion.div
        key={`${course}-${day.date}-${index}`}
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                delay: index * 0.1,
                duration: 0.2,
                ease: 'easeOut',
            },
        }}
        exit={{
            opacity: 0,
            y: -20,
            scale: 0.9,
            transition: {
                duration: 0.1,
                ease: 'easeIn',
            },
        }}
        layout
    >
        <DayScheduleCard day={day} />
    </motion.div>
);
