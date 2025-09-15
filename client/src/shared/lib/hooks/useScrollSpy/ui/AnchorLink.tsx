import { ReactNode } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';

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
            onClick={handleClick}
            className={classNames('hover:underline self-start cursor-pointer text-left', {}, [
                className,
            ])}
        >
            {children}
        </button>
    );
};
