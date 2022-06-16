/**
 * ---------------------------------------------------------------------
 * Created by (pdi1066@naver.com) on 2022-06-15 0015.
 * ---------------------------------------------------------------------
 */
import {defineConfig, loadEnv, UserConfig} from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import {VitePluginNode} from "vite-plugin-node";
import * as dotenv from "dotenv";
import {resolve} from "path";

export default defineConfig(({command, mode}): UserConfig => {

    console.log(`(vite) mode: ${mode} (${command})`);
    console.log(`(vite) cwd: ${process.cwd()}`);

    (() => {
        const isDev = (mode === 'development');
        const envDir = resolve(process.cwd(), '../config');
        if (isDev) {
            // `mode`를 기반으로 env 파일을 불러옴
            const env = loadEnv('dev.local', envDir, '');
            // loadEnv: import.meta.env에 VITE_ 변수 적용 되도록 직접 할당해 주어야함
            process.env = {...process.env, ...env};
        }

        // dotenv: import.meta.env에 VITE_ 변수 자동 적용됨
        const modePath = (isDev) ? 'dev' : 'prod';
        let file = (`${envDir}/.env.${modePath}`);
        dotenv.config({path: file});
    })();

    console.log("(vite) NODE_ENV:", process.env.NODE_ENV);
    console.log("(vite) APP_VERSION:", process.env.VITE_DESC);
    console.error('(vite) STATIC_FOLDER: ', process.env.VITE_WWW_STATIC_FOLDER)

    // 개발/빌드 설정 같음
    //if (mode === 'development') return development();
    //return production();

    const HOST = process.env.HOST || '0.0.0.0';
    const PORT = <number>(process.env.VITE_WWW_PORT || 3000);

    // 참고: build-a-component-library (typescript)
    // https://jivancic.com/posts/build-a-component-library.html#vite-config
    return {

        server: {
            host: HOST,
            port: PORT
        },

        plugins: [
            tsconfigPaths(),

            // https://github.com/axe-me/vite-plugin-node
            ...VitePluginNode({
                // Nodejs native Request adapter
                // currently this plugin support 'express', 'nest', 'koa' and 'fastify' out of box,
                // you can also pass a function if you are using other frameworks, see Custom Adapter section
                //adapter: 'express',
                adapter: 'express',

                // tell the plugin where is your project entry
                appPath: './src/server.ts',

                // Optional, default: 'viteNodeApp'
                // the name of named export of you app from the appPath file
                exportName: 'viteNodeApp',

                // Optional, default: 'esbuild'
                tsCompiler: 'esbuild',
            })
        ]
    };
});


