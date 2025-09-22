import type { Metadata } from 'next';
import { Unbounded } from 'next/font/google';
import type { ReactNode } from 'react';
import { HeroUIProvider, QueryProvider } from '@/app/providers';
import './globals.css';
import { Navbar } from '@/widgets/Navbar';

const unbounded = Unbounded({
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Расписание занятий',
    description:
        'Используйте это приложение для просмотра актуального расписания занятий на 6 факультете',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="ru">
            <body className={unbounded.className}>
                <QueryProvider>
                    <HeroUIProvider>
                        <Navbar />
                        {children}
                    </HeroUIProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
