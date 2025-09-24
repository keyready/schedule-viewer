'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@heroui/theme';
import { Button } from '@heroui/button';
import { useCallback, useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/modal';
import { Input } from '@heroui/input';
import { Lectern } from '../model/types/lectern';
import { Classroom } from '@/entities/classroom';

export const LecternsList = (props: { lecterns: Lectern[]; classrooms: Classroom[] }) => {
    const { lecterns, classrooms } = props;

    const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

    const handleCloseModal = useCallback(() => {
        setIsModalOpened(false);
    }, []);
    const handleOpenModal = useCallback(() => {
        setIsModalOpened(true);
    }, []);

    if (!lecterns?.length)
        return (
            <h3 className="text-danger text-lg italic opacity-60">
                Вы пока не добавили ни одной кафедры
            </h3>
        );

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-6">
                {lecterns.map((lectern) => (
                    <motion.div
                        className={cn(
                            'relative flex flex-col justify-start',
                            'outline-nav w-full rounded px-3 py-1 outline outline-2',
                            'z-10 overflow-hidden',
                        )}
                        initial="rest"
                        whileHover="hover"
                        animate="rest"
                        key={crypto.randomUUID()}
                    >
                        <span className="font-bold">{lectern.title}</span>

                        <div className="mt-3 flex flex-col">
                            <p className="text-sm underline">Аудитории:</p>
                            {classrooms
                                .filter((cr) => cr.kafTitle === lectern.title)
                                .map((cr) => (
                                    <span key={crypto.randomUUID()} className="text-xs">
                                        {cr.title}
                                    </span>
                                ))}
                        </div>

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
                                <Button color="danger" className="h-full w-16 p-0">
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
                ))}
            </div>

            <Button onPress={handleOpenModal} className="bg-nav w-fit text-white">
                <span>Добавить кафедру</span>
                <div className="h-4 w-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                    </svg>
                </div>
            </Button>

            <Modal size="2xl" isOpen={isModalOpened} onClose={handleCloseModal}>
                <ModalContent>
                    <ModalHeader>Добавление кафедры</ModalHeader>
                    <ModalBody className="mb-4 flex flex-col gap-3">
                        <Input
                            size="sm"
                            label="Название кафедры"
                            description='В формате "Номер | Название кафедры"'
                        />
                        <Button className="bg-nav w-fit self-end text-white">Добавить</Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
};
