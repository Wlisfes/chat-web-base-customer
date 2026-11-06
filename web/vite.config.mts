import { resolve } from 'path'
import { defineConfig, type ConfigEnv, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import SvgLoader from 'vite-svg-loader'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import compression from 'vite-plugin-compression'
import { fetchEnvService } from './config'

export default defineConfig(({ mode, isSsrBuild }: ConfigEnv): UserConfig => {
    return {
        root: resolve(__dirname),
        define: fetchEnvService(mode),
        resolve: {
            alias: {
                '@': resolve(__dirname, './')
            }
        },
        build: {
            rollupOptions: {
                output: {
                    format: isSsrBuild ? 'cjs' : 'es'
                }
            }
        },
        ssr: {
            noExternal: ['naive-ui', 'vueuc', 'date-fns', 'vue-i18n', '@css-render/vue3-ssr', 'class-validator', 'aos-observer']
        },
        plugins: [
            vue(),
            vueJsx(),
            SvgLoader({ defaultImport: 'component' }),
            UnoCSS({ mode: 'global' }),
            Components({
                dirs: ['components', 'layouts'],
                extensions: ['vue'],
                dts: 'web.components.d.ts',
                resolvers: [NaiveUiResolver()]
            }),
            compression({ threshold: 10240 })
        ]
    }
})
