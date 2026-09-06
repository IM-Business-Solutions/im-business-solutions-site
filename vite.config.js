import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    publicDir: false,
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        cors: true,
    },
    build: {
        outDir: 'public/build',
        emptyOutDir: true,
        lib: {
            entry: 'assets/app.js',
            formats: ['es'],
            fileName: 'app',
        },
        rolldownOptions: {
            output: {
                entryFileNames: 'app.js',
                chunkFileNames: '[name].js',
                assetFileNames: (assetInfo) => assetInfo.name?.endsWith('.css')
                    ? 'app.css'
                    : 'assets/[name][extname]',
            },
        },
    },
});
