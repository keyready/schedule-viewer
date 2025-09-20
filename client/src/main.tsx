if (typeof exports !== 'undefined') {
    window.exports = exports;
} else {
    window.exports = {};
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app/styles/index.scss';
import './app/styles/tailwind.css';
import { App } from './app/App';
import { StoreProvider } from './app/providers/StoreProvider';
import { ErrorBoundary } from './app/providers/ErrorBoundary';
import { ThemeProvider } from './app/providers/ThemeProvider';
import { PrimeReactProvider } from 'primereact/api';
import { BrowserRouter } from 'react-router';
import { HeroUIProvider } from '@heroui/react';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <StoreProvider>
                <ErrorBoundary>
                    <HeroUIProvider>
                        <ThemeProvider>
                            <PrimeReactProvider>
                                <App />
                            </PrimeReactProvider>
                        </ThemeProvider>
                    </HeroUIProvider>
                </ErrorBoundary>
            </StoreProvider>
        </BrowserRouter>
    </StrictMode>,
);
