import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';


export default defineConfig({
    plugins: [react(), tsconfigPaths({ loose: true }), svgr()],
    server: {
        port: 3000
    },
    esbuild: {
        target: 'esnext',
        platform: 'browser',
    }
})