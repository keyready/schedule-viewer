import { cn } from '@heroui/theme';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@heroui/button';
import { Classroom } from '@/entities/classroom';
import { Lectern } from '../model/types/lectern';
import { lecternApi } from '@/entities/lectern';
import { toast } from 'react-hot-toast';

export const LecternBlock = (props: { classrooms: Classroom[]; lectern: Lectern }) => {
    const { lectern, classrooms } = props;

    const filteredClassrooms = classrooms.filter((cr) => cr.kafTitle === lectern.title);

    const handleDeleteLectern = async () => {
        const deleteLectern = lecternApi.deleteLectern(lectern._id);
        await toast.promise(deleteLectern, {
            error: 'Ошибка во время удаления кафедры',
            success: 'Кафедра удалена',
            loading: 'Обработка запроса',
        });
    };

    return (
        <motion.div
            className={cn(
                'relative flex flex-col justify-start',
                'outline-nav w-full rounded px-3 py-1 outline outline-2',
                'z-10 overflow-hidden',
            )}
            initial="rest"
            whileHover="hover"
            animate="rest"
        >
            <span className="font-bold">{lectern.title}</span>

            {filteredClassrooms?.length ? (
                <div className="mt-3 flex flex-col">
                    <p className="text-sm underline">Аудитории:</p>
                    {filteredClassrooms.map((cr) => (
                        <span key={crypto.randomUUID()} className="text-xs">
                            {cr.title}
                        </span>
                    ))}
                </div>
            ) : null}

            <AnimatePresence mode="wait">
                <motion.div
                    className={cn(
                        'bg-danger h-full w-16',
                        'absolute top-0 right-0 z-9 rounded',
                        'h-full w-16',
                    )}
                    variants={{
                        rest: { opacity: 0, x: 10, pointerEvents: 'none' },
                        hover: { opacity: 1, x: 0, pointerEvents: 'auto' },
                    }}
                    transition={{ duration: 0.2 }}
                >
                    <Button
                        onPress={handleDeleteLectern}
                        color="danger"
                        className="h-full w-16 p-0"
                    >
                        <div className="h-7 w-7 -translate-x-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                {/* eslint-disable-next-line max-len */}
                                <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                            </svg>
                        </div>
                    </Button>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};
