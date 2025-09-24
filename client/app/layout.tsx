import type { Metadata } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import NextTopLoader from 'nextjs-toploader';
import { HeroUIProvider, QueryProvider } from '@/app/providers';
import { Navbar } from '@/shared/ui/Navbar';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const unbounded = localFont({
    src: './fonts/Unbounded-VariableFont_wght.ttf',
    display: 'swap',
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
            <meta name="apple-mobile-web-app-title" content="Раписание" />
            <body className={unbounded.className}>
                <QueryProvider>
                    <HeroUIProvider>
                        <Navbar />
                        <NextTopLoader color="#c7d5e3" />
                        <Toaster />
                        {children}
                    </HeroUIProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
