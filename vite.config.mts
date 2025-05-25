import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';
import { posix } from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@': posix.resolve('./src'),
        },
        extensions: ['.js', '.json', '.mjs', '.ts'],
    },

    plugins: [
        dts({
            include: ['./src/lib/**', './src/types/**'],
            rollupTypes: true,
        }),
    ],

    build: {
        outDir: './dist',
        emptyOutDir: true,
        lib: {
            entry: 'src/main.ts',
            name: 'ScoreboardManager',
            fileName: 'ScoreboardManager',
            formats: ['es', 'cjs', 'umd'],
        },
    },
});
