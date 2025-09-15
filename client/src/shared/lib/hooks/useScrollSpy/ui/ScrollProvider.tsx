import { ReactNode, useEffect } from 'react';
import { useScrollSpy } from '../useScrollSpy';

interface AnchorProviderProps {
    ids: string[];
    onActiveChange?: (id: string | null) => void;
    children: ReactNode;
}

export const AnchorProvider = ({ ids, onActiveChange, children }: AnchorProviderProps) => {
    const activeId = useScrollSpy(ids, 50);

    useEffect(() => {
        onActiveChange?.(activeId);
    }, [activeId, onActiveChange]);

    useEffect(() => {
        if (window.location.hash) {
            const el = document.getElementById(window.location.hash.slice(1));
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
            }
        }
    }, []);

    return <>{children}</>;
};
