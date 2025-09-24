'use client';

import { Button } from '@heroui/button';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/modal';
import { Textarea } from '@heroui/input';
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import { FormEvent, useCallback, useState } from 'react';
import { CreateClassroomAPI } from '../model/types/classroom';
import { classroomApi } from '../model/api/classroom';
import { Lectern } from '@/entities/lectern';
import { toast } from 'react-hot-toast';

export const CreateClassroomModal = (props: { lecterns: Lectern[] }) => {
    const { lecterns } = props;

    const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
    const [newClassrooms, setNewClassrooms] = useState<CreateClassroomAPI>();

    const handleCloseModal = useCallback(() => {
        setIsModalOpened(false);
    }, []);
    const handleOpenModal = useCallback(() => {
        setIsModalOpened(true);
    }, []);

    const handleSaveClassrooms = useCallback(
        async (ev: FormEvent<HTMLFormElement>) => {
            ev.preventDefault();
            if (newClassrooms) {
                const createClassroom = classroomApi.createClassrooms(newClassrooms);
                const res = await toast.promise(createClassroom, {
                    error: 'Ошибка во время создания аудитории',
                    success: 'Аудитория создана',
                    loading: 'Обработка запроса',
                });
                if (res.ok) {
                    setIsModalOpened(false);
                    setNewClassrooms(undefined);
                }
            }
        },
        [newClassrooms],
    );

    return (
        <>
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
                        <form onSubmit={handleSaveClassrooms}>
                            <Textarea
                                classNames={{
                                    inputWrapper: 'h-fit',
                                }}
                                minRows={8}
                                size="sm"
                                label="Номер аудитории"
                                placeholder="По одной аудитории на строку"
                                onValueChange={(v) =>
                                    setNewClassrooms((ps) => ({ ...ps, audsTitles: v.split('\n') }))
                                }
                            />
                            <Autocomplete
                                size="sm"
                                defaultItems={lecterns || []}
                                label="Выберите кафедру"
                                listboxProps={{ emptyContent: 'Ничего не найдено' }}
                                onSelectionChange={(v) =>
                                    setNewClassrooms((ps) => ({
                                        ...ps,
                                        parentKafId: v?.toString(),
                                    }))
                                }
                            >
                                {(item) => (
                                    <AutocompleteItem key={item._id}>{item.title}</AutocompleteItem>
                                )}
                            </Autocomplete>
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
