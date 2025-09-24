'use client';

import { Classroom } from '../model/types/classroom';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@heroui/theme';
import { Button } from '@heroui/button';
import { useCallback, useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/modal';
import { Textarea } from '@heroui/input';
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import { Lectern } from '@/entities/lectern';

export const ClassroomsList = (props: { lecterns: Lectern[]; classrooms: Classroom[] }) => {
    const { classrooms, lecterns } = props;

    const [isModalOpened, setIsModalOpened] = useState<boolean>(false);

    const handleCloseModal = useCallback(() => {
        setIsModalOpened(false);
    }, []);
    const handleOpenModal = useCallback(() => {
        setIsModalOpened(true);
    }, []);

    if (!classrooms?.length)
        return (
            <h3 className="text-danger text-lg italic opacity-60">
                Вы пока не добавили ни одной аудитории
            </h3>
        );

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-5 gap-3">
                {classrooms.map((classroom) => (
                    <motion.div
                        className={cn(
                            'flex justify-between',
                            'outline-nav w-full rounded px-3 py-1 outline outline-2',
                            'hover:bg-nav/30 cursor-pointer duration-100',
                        )}
                        initial="rest"
                        whileHover="hover"
                        animate="rest"
                        key={crypto.randomUUID()}
                    >
                        <span>{classroom.title}</span>
                        <AnimatePresence mode="wait">
                            <motion.button
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
                ))}
            </div>

            <Button onPress={handleOpenModal} className="bg-nav w-fit text-white">
                <span>Добавить аудиторию</span>
                <div className="h-4 w-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                    </svg>
                </div>
            </Button>

            <Modal size="2xl" isOpen={isModalOpened} onClose={handleCloseModal}>
                <ModalContent>
                    <ModalHeader>Добавление аудитории</ModalHeader>
                    <ModalBody className="mb-4 flex flex-col gap-3">
                        <Textarea
                            classNames={{
                                inputWrapper: 'h-fit',
                            }}
                            minRows={8}
                            size="sm"
                            label="Номер аудитории"
                            placeholder="По одной аудитории на строку"
                        />
                        <Autocomplete
                            size="sm"
                            defaultItems={lecterns || []}
                            label="Выберите кафедру"
                            listboxProps={{ emptyContent: 'Ничего не найдено' }}
                        >
                            {(item) => (
                                <AutocompleteItem key={item._id}>{item.title}</AutocompleteItem>
                            )}
                        </Autocomplete>
                        <Button className="bg-nav w-fit self-end text-white">Добавить</Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
};
