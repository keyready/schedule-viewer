import { useEffect, useState } from 'react';

export function useScrollSpy(ids: string[], offset: number = 0) {
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        const elements = ids
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => Boolean(el));

        if (elements.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                        window.history.replaceState(null, '', `#${entry.target.id}`);
                    }
                });
            },
            {
                rootMargin: `-${offset}px 0px -80% 0px`,
                threshold: 0.1,
            },
        );

        elements.forEach((el) => observer.observe(el));

        return () => {
            elements.forEach((el) => observer.unobserve(el));
        };
    }, [ids, offset]);

    return activeId;
}
