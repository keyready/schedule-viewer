'use client';

import { Button } from '@heroui/button';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/modal';
import { Input } from '@heroui/input';
import { FormEvent, useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { lecternApi } from '@/entities/lectern';

export const CreateLecternModal = () => {
    const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
    const [newLectern, setNewLectern] = useState<string>();

    const handleCloseModal = useCallback(() => {
        setIsModalOpened(false);
    }, []);
    const handleOpenModal = useCallback(() => {
        setIsModalOpened(true);
    }, []);

    const handleFormSubmit = useCallback(
        async (ev: FormEvent<HTMLFormElement>) => {
            ev.preventDefault();
            if (newLectern) {
                const createClassroom = lecternApi.createLectern(newLectern);
                const res = await toast.promise(createClassroom, {
                    error: 'Ошибка во время создания кафедры',
                    success: 'Кафедра создана',
                    loading: 'Обработка запроса',
                });
                if (res.ok) {
                    setIsModalOpened(false);
                    setNewLectern(undefined);
                }
            }
        },
        [newLectern],
    );

    return (
        <>
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
                        <form className="flex flex-col gap-3" onSubmit={handleFormSubmit}>
                            <Input
                                size="sm"
                                label="Название кафедры"
                                description='В формате "Номер | Название кафедры"'
                                value={newLectern}
                                onValueChange={setNewLectern}
                            />
                            <Button type="submit" className="bg-nav w-fit self-end text-white">
                                Добавить
                            </Button>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
