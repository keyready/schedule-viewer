import { ReactNode } from 'react';
import Link from 'next/link';
import { Page } from '@/shared/ui/Page';

export default async function SettingsLayout({ children }: { children: ReactNode }) {
    return (
        <Page className="relative flex gap-3 py-10">
            <div className="sticky top-0 flex h-fit w-1/3 flex-col gap-5">
                <h1 className="text-3xl font-bold">Настройки</h1>
                <ol>
                    <li>
                        <Link className="hover:underline" href="/settings/lecterns">
                            Редактировать кафедры
                        </Link>
                    </li>
                    <li>
                        <Link className="hover:underline" href="/settings/classrooms">
                            Редактировать аудитории
                        </Link>
                    </li>
                </ol>
            </div>

            <div className="w-full">{children}</div>
        </Page>
    );
}
