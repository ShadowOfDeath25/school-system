import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@ui': path.resolve(__dirname, 'src/components/ui'),
            '@pages': path.resolve(__dirname, 'src/components/pages'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@hooks': path.resolve(__dirname, 'src/hooks'),
            '@guards': path.resolve(__dirname, 'src/components/guards'),
            '@layouts': path.resolve(__dirname, 'src/components/layouts'),
            '@features': path.resolve(__dirname, 'src/features'),
            '@contexts': path.resolve(__dirname, 'src/context'),
            '@routes': path.resolve(__dirname, 'src/routes'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@fonts': path.resolve(__dirname, 'src/assets/fonts'),
            '@reports': path.resolve(__dirname, 'src/components/reports'),
            '@constants': path.resolve(__dirname, 'src/utils/constants'),
            '@helpers': path.resolve(__dirname, 'src/utils/helpers')

        },
    },
})
