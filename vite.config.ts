import { VitePluginFonts } from 'vite-plugin-fonts'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/twilight/',
    plugins: [
        react(),
        VitePluginFonts({
            google: {
                families: ['Be Vietnam Pro'],
            },
        }),
    ],
})
