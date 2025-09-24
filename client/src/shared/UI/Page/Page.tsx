import { ReactNode } from 'react';
import { cn } from '@heroui/theme';

export const Page = ({ children, className }: { children: ReactNode; className?: string }) => {
    return (
        <div className={cn('flex h-[calc(100vh_-_60px)] overflow-y-auto px-10', className)}>
            {children}
        </div>
    );
};
