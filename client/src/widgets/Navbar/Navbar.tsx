import Link from 'next/link';

export const Navbar = () => (
    <nav className="px-10 bg-nav h-15 flex items-center justify-start w-full">
        <Link href="/" className="text-[rgb(199,213,227)] text-lg">
            Общее расписание
        </Link>
    </nav>
);
