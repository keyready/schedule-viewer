'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '@heroui/theme';

export const MovablePageTitle = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
            threshold: 0.1,
        });

        observer.observe(element);
        return () => {
            if (element) observer.unobserve(element);
        };
    }, []);

    return (
        <>
            <div ref={ref} className="mt-5 flex w-full items-center justify-center">
                <h1 className="w-full text-center text-4xl font-bold transition-all duration-500">
                    {children}
                </h1>
            </div>

            <div
                id="navbar-title"
                className={cn(
                    'fixed top-3.5 right-1/2 left-0 z-40 translate-x-1/2',
                    'flex justify-center text-[rgb(199,213,227)] transition-all duration-200',
                    className,
                    isVisible ? '-translate-y-10 opacity-0' : 'translate-y-0 opacity-100',
                )}
            >
                <h1 className="text-xl font-bold tracking-wider">{children}</h1>
            </div>
        </>
    );
};
