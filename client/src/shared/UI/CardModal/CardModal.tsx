'use client';

import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@heroui/theme';
import { createPortal } from 'react-dom';

interface CardModalProps {
    id: string | number;
    children: ReactNode;
    altContent?: ReactNode;
    cardClassName?: string;
    modalClassName?: string;
    isDisabled?: boolean;
}

export const CardModal = (props: CardModalProps) => {
    const { id, children, isDisabled, altContent, cardClassName, modalClassName } = props;

    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const handleKeyPress = (ev: KeyboardEvent) => {
            if (ev.key.toLowerCase() === 'escape') {
                ev.preventDefault();
                setOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, []);

    const handleOpenModalClick = useCallback(() => {
        setOpen(true);
    }, []);

    return (
        <>
            <AnimatePresence>
                {open ? (
                    <div className={`invisible ${cardClassName}`}>{children}</div>
                ) : (
                    <motion.button
                        type="button"
                        disabled={isDisabled}
                        layoutId={id.toString()}
                        onClick={handleOpenModalClick}
                        className={cn('cursor-pointer', cardClassName, isDisabled && 'cursor-auto')}
                    >
                        {children}
                    </motion.button>
                )}
            </AnimatePresence>

            {mounted &&
                createPortal(
                    <AnimatePresence>
                        {open && (
                            <motion.div
                                className={cn(
                                    'fixed inset-0 z-50 bg-black/50',
                                    'flex items-center justify-center backdrop-blur',
                                )}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setOpen(false)}
                            >
                                <motion.div
                                    layoutId={id.toString()}
                                    className={cn(
                                        'relative rounded-2xl bg-white shadow-xl',
                                        'h-1/3 w-2/5 overflow-y-auto px-3 py-4',
                                        modalClassName,
                                    )}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        className="absolute top-3 right-3 text-gray-500 hover:text-black"
                                        onClick={() => setOpen(false)}
                                    >
                                        ✖
                                    </button>
                                    {altContent ?? children}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body,
                )}
        </>
    );
};
