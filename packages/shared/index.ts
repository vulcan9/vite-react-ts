/**
 * ---------------------------------------------------------------------
 * Created by (pdi1066@naver.com) on 2022-06-13 0013.
 * ---------------------------------------------------------------------
 */
const hello = () => {
    return 'hello workspace shared!';
};

//module.exports = hello;
export default hello;


/*
// vite.config.ts 라이브러리 모드 참고

import {defineConfig} from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig(({command, mode}) => {

    console.log(`mode: ${mode} (${command})`);
    console.log(`cwd: ${process.cwd()}`);

    // 참고: build-a-component-library (typescript)
    // https://jivancic.com/posts/build-a-component-library.html#vite-config
    return {

        plugins: [
            tsconfigPaths(),
            // 라이브럴 모드에서는 지원되지 않음
            //legacy(),
        ],

        build: {
            lib: {
                entry: path.resolve(__dirname, 'src/server.ts'),

                name: 'server',

                // 적절한 확장자가 추가됩니다.
                fileName: (format) => `server.${format}.js`
            },
            rollupOptions: {
                input: {
                    'server': path.resolve(__dirname, 'src/server.ts')
                },
                // 라이브러리에 포함하지 않을 디펜던시를 명시해주세요
                external: [
                    //'lodash'
                ],
                output: {
                    // 라이브러리 외부에 존재하는 디펜던시를 위해
                    // UMD(Universal Module Definition) 번들링 시 사용될 전역 변수를 명시할 수도 있습니다.
                    //globals: {}
                }
            }
        }
    }
});
*/
