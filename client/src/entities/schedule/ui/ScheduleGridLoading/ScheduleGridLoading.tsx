import { motion } from 'framer-motion';
import { Skeleton } from '@heroui/skeleton';

export const ScheduleGridLoading = () => (
    <motion.div
        className="w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
    >
        {new Array(3).fill(0).map((_, courseIndex) => (
            <motion.div
                key={courseIndex}
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
            >
                <motion.div
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
                    <Skeleton className="h-[50px] w-1/3 rounded-xl" />
                </motion.div>
                <div className="grid grid-cols-3 gap-4">
                    {new Array(5).fill(0).map((_, cardIndex) => (
                        <motion.div
                            key={cardIndex}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                transition: {
                                    delay: courseIndex * 0.2 + cardIndex * 0.1,
                                    duration: 0.2,
                                    ease: 'easeOut',
                                },
                            }}
                        >
                            <Skeleton className="h-[220px] w-full rounded-xl" />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        ))}
    </motion.div>
);
