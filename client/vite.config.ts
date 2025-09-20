import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths(), tailwindcss()],
    build: {
        outDir: '../server/dist',
    },
    optimizeDeps: {
        include: ['react-loadable'],
    },
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:5000/api',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\//, ''),
            },
        },
    },
});
