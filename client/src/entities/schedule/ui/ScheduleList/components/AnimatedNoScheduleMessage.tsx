import { motion } from 'framer-motion';

export const AnimatedNoScheduleMessage = () => (
    <motion.div
        key="no-schedule"
        className="col-span-3 ml-10 text-xl text-red-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.2,
                ease: 'easeOut',
            },
        }}
        exit={{
            opacity: 0,
            y: -20,
            transition: {
                duration: 0.1,
                ease: 'easeIn',
            },
        }}
    >
        На этом курсе нет занятий в выбранной аудитории
    </motion.div>
);
