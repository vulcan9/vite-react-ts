// 환경 변수 파일 읽기
// https://github.com/motdotla/dotenv
import * as dotenv from "dotenv";
import {resolve} from 'path'
import {defineConfig, UserConfig} from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import * as _ from 'lodash'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/

const config = {
    //root: process.cwd(),
    //base: '/',
    //mode: process.env.NODE_ENV,

    // '.env' 파일이 로드되는 디렉터리입니다.
    // 절대 경로 또는 프로젝트 루트에 상대적인 경로일 수 있습니다.
    //envDir: '/',
    //envPrefix: 'VITE_',

    // 정적 에셋들을 제공하는 디렉터리
    // 이 디렉터리의 파일들은 개발 중에는 / 에서 제공되고 빌드 시에는 outDir의 루트로 복사되며,
    // 변형 없이 언제나 있는 그대로 제공되거나 복사됩니다.
    // 값은 절대 파일 시스템 경로 또는 프로젝트 루트의 상대적인 경로중 하나가 될 수 있습니다.
    //publicDir: 'public'

    // 정적 에셋 가져오기
    // 빌트인 에셋 형식 목록: https://github.com/vitejs/vite/blob/main/packages/vite/src/node/constants.ts
    //assetsInclude: ['**/*.gltf'],

    plugins: [
        react(),

        // vite-tsconfig-paths
        // resolve imports using TypeScript's path mapping.
        // https://www.npmjs.com/package/vite-tsconfig-paths
        // 일반적으로 Typescript 프로젝트에서는
        // import * as ssl from '../../../services/ssl' 과 같은 import 경로를 피하기 위해
        // 절대 경로 import를 많이 사용합니다.
        // tsconfig.json 을 수정하면
        // import * as ssl from '@src/services/ssl' 처럼 절대 경로로 import 할 수 있습니다.
        tsconfigPaths(),

        // 레거시 브라우저의 경우 `@vitejs/plugin-legacy` 플러그인을 이용
        // 레거시 청크는 브라우저가 ESM을 지원하지 않는 경우에만 사용됨
        // https://www.npmjs.com/package/@vitejs/plugin-legacy
        legacy(),

        //viteMockServe({
        //    mockPath: 'mock',
        //    supportTs: true,
        //    watchFiles: true,
        //    localEnabled: command === 'serve',
        //    logger: true,
        //}),

        // vite-plugin-mkcert
        // for vite https development services. (install the local CA certificate)
        //mkcert()
    ],

    resolve: {
        // 이 옵션의 값은 @rollup/plugin-alias 의 entries 옵션으로 전달됩니다
        // vite-tsconfig-paths 플러그인 사용으로 tsconfig.json 에서만 설정해 주어도 됨
        //alias: [],

        // 확장자를 생략한 가져오기를 위해 시도할 파일 확장자 목록
        //extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']

        //preserveSymlinks: false
    },

    css: {
        // CSS 전처리기로 전달할 옵션을 지정합니다.
        //preprocessorOptions: {
        //    scss: {
        //        additionalData: `$injectedColor: orange;`
        //    },
        //    less: {
        //        javascriptEnabled: true,
        //        modifyVars: {
        //            '@primary-color': '#1890ff',
        //        },
        //    },
        //}
    },

    // 디펜던시의 사전 번들링을 강제
    //force: true
    //cacheDir: 'node_modules/.vite'

    optimizeDeps: {
        // 사전 번들링에서 제외할 디펜던시 목록
        // CommonJS 디펜던시는 최적화에서 제외돼서는 안 됩니다.
        //exclude: [],

        // 기본적으로 node_modules 내부에 없는 연결된 패키지들은 미리 번들로 제공되지 않습니다.
        // 이 옵션을 사용하여 연결된 패키지를 미리 번들로 묶을 수 있습니다.
        //include: ['esm-dep > cjs-dep'],

        // 디펜던시 스캐닝 및 최적화 중 Esbuild에 전달할 옵션
        //esbuildOptions: []
    },

    build: {
        //minify: 'esbuild',

        // outDir이 프로젝트 루트 내부에 있는 경우 빌드할 때 이 곳을 비웁니다.
        // outDir가 루트 외부에 있으면 실수로 중요한 파일을 제거하지 않도록 경고 메시지가 표시됩니다.
        // 경고를 표시하지 않도록 이 옵션을 명시적으로 설정할 수 있습니다.
        // 명령 줄에서는 --emptyOutDir로 이를 사용할 수 있습니다.
        //emptyOutDir: true,

        // 청크 크기 경고를 위한 제한값 입니다. (단위: KB)
        //chunkSizeWarningLimit: 500
    },

    // https://rollupjs.org/guide/en/#big-list-of-options
    //rollupOptions: {},

    // SSR 옵션
    // https://vitejs-kr.github.io/config/ssr-options.html#ssr-external
    //ssr: {}
}

function common(): UserConfig {

    console.log("APP_VERSION:", process.env.VITE_DESC);

    return {

    }

    /*
    const {
        APP_VERSION = '0.0.0'
    } = process.env;

    return {
        // 소스에서 치환할 문자열을 정의
        // https://esbuild.github.io/api/#define
        // 치환될 문자열은 ts 파일에서 타입체크를 통과 시켜 주어야함 (.d.ts 파일)
        define: {
            "__APP_VERSION__": JSON.stringify(APP_VERSION) // '"'+ APP_VERSION +'"'
        },
    }
    */
}

function development(): UserConfig {

    const {
        PORT = 3000,
        HOST = '0.0.0.0'
    } = process.env;

    return _.merge(common(), {
        //...config,

        server: {
            //...(config as any).server,

            port: PORT,
            host: HOST,

            // https://vitejs-kr.github.io/config/server-options.html#server-proxy
            proxy: {
                //'/api': {
                //    target: `http://localhost:${PORT}`,
                //    rewrite: path => path.replace(/^\/api/, '')
                //},

                // 웹소켓 또는 socket.io 프록시
                '/socket.io': {
                    target: 'ws://localhost:5173',
                    ws: true
                }
            }
        }
    });
}

function production(): UserConfig {

    return _.merge(common(), {
        //...config,

        //root: process.cwd(),
        //base: '/web/',

        build: {
            //...(config as any).build,

            //outDir: 'dist/web',
            //sourcemap: false,

            //rollupOptions: {
            //    input: {
            //        main: resolve(__dirname, 'index.html'),
            //        app: resolve(__dirname, 'dist/app/index.html')
            //    }
            //}
        },
    });
}

//----------------------
// 조건부 설정
//----------------------

export default defineConfig(({command, mode}) => {

    console.log(`mode: ${mode} (${command})`);

    (() => {
        /*
        // `mode`를 기반으로 env 파일을 불러옴
        // import.meta.env에는 변수 적용되지 않음
        const envDir = resolve(process.cwd(), 'src');
        const env = loadEnv('dev', envDir, '')
        console.log("envDir:", envDir);
        console.log("APP_VERSION:", env.APP_VERSION);
        */
        process.env.NODE_ENV = mode;
        console.log("NODE_ENV:", process.env.NODE_ENV);

        const modePath = (mode === 'development') ? 'dev.local' : 'prod';
        let file = resolve(process.cwd(), `./src/.env.${modePath}`);
        //let file = `./src/.env.${mode}`;

        dotenv.config({path: file});
    })();

    // 개발 서버 설정
    if (command === 'serve') return _.merge(config, development());

    // 빌드 설정
    if (command === 'build') return _.merge(config, production());
})

//----------------------
// 인텔리센스 설정
//----------------------

/*
export default defineConfig({
    plugins: [react()]
})
*/

//----------------------
// 비동기 설정
//----------------------

/*
export default defineConfig(async ({ command, mode }) => {
    const data = await asyncFunction();
    return {
        // Vite 설정 값 전달
    }
})
*/

//----------------------
// 환경 변수
//----------------------

/*
export default defineConfig(({ command, mode }) => {
    // loadEnv 헬퍼를 사용해 .env 파일을 불러올 수도 있음
    // 현재 작업 디렉터리의 `mode`를 기반으로 env 파일을 불러옴
    // 세 번째 매개변수를 ''로 설정하면 `VITE_` 접두사에 관계없이 모든 환경 변수를 불러옴
    const env = loadEnv(mode, process.cwd(), '');

    return {
        // Vite 설정
        define: {
            __APP_ENV__: env.APP_ENV
        }
    }
})
*/