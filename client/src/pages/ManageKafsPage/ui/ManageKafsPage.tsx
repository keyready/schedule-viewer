import { classNames } from 'shared/lib/classNames/classNames';
import { Page } from 'widgets/Page/Page';
import { FormEvent, memo, useCallback, useRef, useState } from 'react';
import { Text } from 'shared/UI/Text';
import {
    useCreateKaf,
    useKafs,
    useDeleteKaf,
    useDeleteAud,
    useCreateAud,
    useAuds,
} from 'pages/SchedulePage';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { HStack, VStack } from 'shared/UI/Stack';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { IKaf } from 'pages/SchedulePage/api/fetchKafsApi';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import classes from './ManageKafsPage.module.scss';

interface ManageKafsPageProps {
    className?: string;
}

const ManageKafsPage = memo((props: ManageKafsPageProps) => {
    const { className } = props;

    const [kafTitle, setKafTitle] = useState<string>('');
    const [selectedKaf, setSelectedKaf] = useState<IKaf | null>();
    const [audTitles, setAudTitles] = useState<string>('');

    const { data: kafedras, isLoading: isKafsLoading, refetch: kafsRefetch } = useKafs();
    const { data: auditories, isLoading: isAudsLoading, refetch: audsRefetch } = useAuds();
    const [createKaf] = useCreateKaf();
    const [deleteKaf] = useDeleteKaf();
    const [deleteAud] = useDeleteAud();
    const [createAud] = useCreateAud();

    const handleFormSubmit = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            await createKaf(kafTitle);
            await kafsRefetch();
            setKafTitle('');
        },
        [createKaf, kafTitle, kafsRefetch],
    );

    const handleAudsFormSubmit = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (!selectedKaf?._id) return;
            await createAud({ parentKafId: selectedKaf?._id, audsTitles: audTitles.split('\n') });
            await audsRefetch();
            setSelectedKaf(null);
            setAudTitles('');
        },
        [audTitles, audsRefetch, createAud, selectedKaf?._id],
    );

    const handleKafDeleteClick = useCallback(
        async (kafId: string) => {
            await deleteKaf({ kafId });
            await kafsRefetch();
            await audsRefetch();
        },
        [deleteKaf, kafsRefetch, audsRefetch],
    );

    const handleAudDeleteClick = useCallback(
        async (audId: string) => {
            await deleteAud({ audId });
            await audsRefetch();
        },
        [deleteAud, audsRefetch],
    );

    const handleSelectedKafChange = useCallback((event: DropdownChangeEvent) => {
        setSelectedKaf(event.value);
    }, []);

    return (
        <Page className={classNames(classes.ManageKafsPage, {}, [className])}>
            <Text size="large" title="Управление кафедрами и аудиториями" />

            <Divider className={classes.divider}>
                <Text title="Добавленные кафедры" />
            </Divider>
            <VStack maxW gap="8" className={classes.kafsWrapper}>
                {kafedras?.length &&
                    !isKafsLoading &&
                    kafedras.map((kaf) => (
                        <HStack maxW key={kaf._id} justify="between">
                            <Text title={kaf.title} />
                            <Button
                                onClick={() => handleKafDeleteClick(kaf._id)}
                                severity="danger"
                                size="small"
                                text
                            >
                                Удалить
                            </Button>
                        </HStack>
                    ))}
            </VStack>

            <form className={classes.form} onSubmit={handleFormSubmit}>
                <VStack maxW gap="8">
                    <Message
                        style={{ width: '100%' }}
                        severity="warn"
                        text={'Название кафедры в формате "Номер | Название"'}
                    />
                    <HStack maxW gap="16">
                        <InputText
                            value={kafTitle}
                            onChange={(e) => setKafTitle(e.target.value)}
                            placeholder="Введите номер и название кафедры"
                            style={{ width: '50%' }}
                        />
                        <Button disabled={!kafTitle}>Добавить кафедру</Button>
                    </HStack>
                </VStack>
            </form>

            <Divider className={classes.divider}>
                <Text title="Добавленные аудитории" />
            </Divider>
            <VStack maxW gap="8" className={classes.kafsWrapper}>
                {auditories?.length &&
                    !isAudsLoading &&
                    auditories.map((aud) => (
                        <HStack maxW key={aud._id} justify="between">
                            <Text title={aud.title} />
                            <Button
                                onClick={() => handleAudDeleteClick(aud._id)}
                                severity="danger"
                                size="small"
                                text
                            >
                                Удалить
                            </Button>
                        </HStack>
                    ))}
            </VStack>

            <form className={classes.form} onSubmit={handleAudsFormSubmit}>
                <VStack maxW gap="8">
                    <InputTextarea
                        autoResize
                        cols={35}
                        rows={5}
                        value={audTitles}
                        onChange={(e) => setAudTitles(e.target.value)}
                        placeholder="Введите номера аудитории (по одному номеру на строку)"
                        style={{ width: '50%' }}
                    />
                    <Dropdown
                        value={selectedKaf}
                        onChange={handleSelectedKafChange}
                        options={kafedras}
                        optionLabel="title"
                        emptyMessage="Ничего не найдено"
                        placeholder="Введите кафедру, за которой закреплена аудитория"
                    />
                    <Button disabled={!audTitles?.length || !selectedKaf}>Добавить кафедру</Button>
                </VStack>
            </form>
        </Page>
    );
});

export default ManageKafsPage;
