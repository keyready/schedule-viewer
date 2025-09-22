import { ReactNode } from 'react';
import { cn } from '@heroui/theme';

interface AnchorLinkProps {
    to: string;
    children: ReactNode;
    className?: string;
}

export const AnchorLink = ({ to, children, className }: AnchorLinkProps) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const el = document.getElementById(to);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            window.history.pushState(null, '', `#${to}`);
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={cn('focus:outline-none self-start cursor-pointer text-left', className)}
        >
            {children}
        </button>
    );
};
