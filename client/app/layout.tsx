import type { Metadata } from 'next';
import { Unbounded } from 'next/font/google';
import type { ReactNode } from 'react';
import NextTopLoader from 'nextjs-toploader';
import { HeroUIProvider, QueryProvider } from '@/app/providers';
import { Navbar } from '@/widgets/Navbar';
import './globals.css';

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
                        <NextTopLoader color="#c7d5e3" />
                        {children}
                    </HeroUIProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
