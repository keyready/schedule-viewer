'use client';

import { cn } from '@heroui/theme';
import { AnimatePresence, motion } from 'framer-motion';
import { Classroom } from '../model/types/classroom';
import { useCallback } from 'react';
import { classroomApi } from '@/entities/classroom';
import { toast } from 'react-hot-toast';

export const ClassroomCard = ({ classroom }: { classroom: Classroom }) => {
    const handleDeleteClassroom = useCallback(async (classroomId: string) => {
        const deleteClassroom = classroomApi.deleteClassroom(classroomId);
        await toast.promise(deleteClassroom, {
            error: 'Ошибка во время удаления аудитории',
            success: 'Аудитория удалена',
            loading: 'Обработка запроса',
        });
    }, []);

    return (
        <motion.div
            className={cn(
                'flex justify-between',
                'outline-nav w-full rounded px-3 py-1 outline outline-2',
                'hover:bg-nav/30 cursor-pointer duration-100',
            )}
            initial="rest"
            whileHover="hover"
            animate="rest"
        >
            <span className="truncate">{classroom.title}</span>
            <AnimatePresence mode="wait">
                <motion.button
                    onClick={() => handleDeleteClassroom(classroom._id)}
                    className={cn(
                        'text-danger h-7 w-7 cursor-pointer',
                        'flex items-center justify-center duration-200',
                        'active:bg-danger rounded-full active:text-white',
                    )}
                    variants={{
                        rest: { opacity: 0, x: 10, pointerEvents: 'none' },
                        hover: { opacity: 1, x: 0, pointerEvents: 'auto' },
                    }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="h-5 w-5">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            {/* eslint-disable-next-line max-len */}
                            <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path>
                        </svg>
                    </div>
                </motion.button>
            </AnimatePresence>
        </motion.div>
    );
};
