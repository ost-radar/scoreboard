import { defineConfig } from 'vite'
import { posix } from 'path'

export default defineConfig({
    resolve: {
        alias: {
            '@': posix.resolve('./src'),
        },
        extensions: ['.js', '.json', '.mjs', '.ts'],
    },

    build: {
        outDir: './dist',
        emptyOutDir: true,
        rollupOptions: {
            input: 'src/main.ts',
            output: {
                entryFileNames: '[name].js',
            },
        },
    },
});
