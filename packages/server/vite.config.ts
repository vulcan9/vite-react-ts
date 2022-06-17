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
import * as _ from "lodash";

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
    console.log("(vite) APP_VERSION:", process.env.VITE_APP_VERSION);
    console.error('(vite) STATIC_FOLDER: ', process.env.VITE_WWW_STATIC_FOLDER)


    // 개발 서버 설정
    if (mode === 'development') return _.merge(getConfig(), development());

    // 빌드 설정
    return _.merge(getConfig(), production());
});

function getConfig() {
    const config = {

        // public 폴더 위치 지정: 정적 에셋들을 제공하는 디렉터리
        // 이 디렉터리의 파일들은 개발 중에는 / 에서 제공되고 빌드 시에는 outDir의 루트로 복사됨
        // 변형 없이 언제나 있는 그대로 제공되거나 복사됩니다.
        // 값은 절대 파일 시스템 경로 또는 프로젝트 루트의 상대적인 경로중 하나가 될 수 있습니다.
        //publicDir: 'public'
        publicDir: process.env.WEB_PUBLIC_DIR,

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
    return config;
}

function development(): UserConfig {

    const HOST = process.env.HOST || '0.0.0.0';
    const PORT = <number>(process.env.VITE_WWW_PORT || 3000);

    return {

        server: {
            host: HOST,
            port: PORT
        },

    }
}

function production(): UserConfig {

    return {
        //base: './',

        build: {
            //sourcemap: false,

            // preview를 실행하면 자동으로 outDir 경로의 파일을 실행해 줌
            outDir: '../../dist/server',
            // 기본값: outDir이 root 안에 있다면 true
            emptyOutDir: true,
        }
    }

}
