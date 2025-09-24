import Link from 'next/link';

export const Navbar = () => (
    <nav className="bg-nav flex h-15 w-full items-center justify-between px-10">
        <Link href="/" className="text-lg text-[rgb(199,213,227)]">
            Общее расписание
        </Link>
        <Link href="/settings/lecterns" className="text-md text-[rgb(199,213,227)]">
            Настройки
        </Link>
    </nav>
);
