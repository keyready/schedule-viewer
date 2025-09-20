'use client';

import { HeroUIProvider as Provider } from '@heroui/react';
import { ReactNode } from 'react';

export const HeroUIProvider = ({ children }: { children: ReactNode }) => (
    <Provider>{children}</Provider>
);
