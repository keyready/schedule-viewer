import {
    FormEvent,
    memo,
    useCallback,
    useEffect,
    useState,
} from 'react';
import { HStack } from 'shared/UI/Stack';
import { Input } from 'shared/UI/Input';
import { Button } from 'shared/UI/Button';
import Cookie from 'js-cookie';

interface FetchGroupsFormProps {
    setScheduleDir: (value: string) => void;
    // scheduleDir: string;
    // setIsAttemptedQuery: (flag: boolean) => void;
}

export const FetchGroupsForm = memo((props: FetchGroupsFormProps) => {
    const { setScheduleDir } = props;

    const [directory, setDirectory] = useState<string>('');

    useEffect(() => {
        const cookieDirectory = Cookie.get('workDir');
        if (cookieDirectory) {
            setScheduleDir(cookieDirectory);
            setDirectory(cookieDirectory);
        }
    }, [setScheduleDir]);

    const handleFetchGroups = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setScheduleDir(directory);
            Cookie.set('workDir', directory);
        },
        [directory, setScheduleDir],
    );

    return (
        <form onSubmit={handleFetchGroups}>
            <HStack maxW gap="32">
                <Input
                    placeholder="Введите путь до папки с расписаниями"
                    onChange={setDirectory}
                    value={directory}
                />
                <Button type="submit">Загрузить</Button>
            </HStack>
        </form>
    );
});
