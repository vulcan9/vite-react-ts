/**
 * ---------------------------------------------------------------------
 * Created by (pdi1066@naver.com) on 2022-06-14 0014.
 * ---------------------------------------------------------------------
 */

import express, {NextFunction, Request, Response} from 'express';
import router from './router';
import {dirname, resolve} from 'path';
import morgan from 'morgan';
import {fileURLToPath} from "url";

//------------------------------------
// 환경 변수 확인
//------------------------------------

// 개발 환경에서는 Vite가 환경 변수를 로드해서 세팅 해줌
// production 환경에서는 import.meta.env 사용
const env = import.meta.env;
console.log('* ENV: ', env);

const isProd = env.PROD;
//const HOST = env.HOST || '0.0.0.0';
const PORT = <number>(env.VITE_WWW_PORT || 3000);
const STATIC_FOLDER = (env.VITE_WWW_STATIC_FOLDER || '');
process.env.NODE_ENV = env.MODE;

// 서버 실행 파일 위치를 기준으로 상대 경로로 리소스 찾음
// 개발시 경로: ~/packages/server/src'
// 빌드시 경로: ~/dist/server
// ES module에서 CommonJS 변수 지원 안함 (__dirname is not defined)
// __dirname : https://github.com/nodejs/node/pull/28282/files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://blog.logrocket.com/alternatives-dirname-node-js-es-modules/
//const __dirname = fileURLToPath(new URL('./', import.meta.url));

console.table({
    "(WWW) cwd": process.cwd(),
    "__dirname": __dirname,
    "NODE_ENV": process.env.NODE_ENV,
    "PORT": PORT
});

//------------------------------------
// 서버 구성
//------------------------------------

const app = express();
if (isProd) app.use(morgan('dev'));

// for parsing application/json
app.use(express.json());
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}))

// 디버깅용 로그 코드 작업
app.use('*?/debug', debug);

// Serve API requests from the router
app.use('/api', router);

// Serve storybook production bundle
// app.use('/storybook', express.static('dist/storybook'));

// 환경 변수에 기록된 경로를 static 폴더로 지정
setStaticFolder(STATIC_FOLDER);

// 기본 에러 처리
app.use(errorHandler);

// Handle client routing, return all requests to the app
app.get('*', defaultResponse);

// 서버 시작
serverRun();

// Vite : 패키지의 진입점이 되는 파일에는
// vite-plugin-node 플러그인이 import 할 수 있도록
// export 구문을 포함
export const viteNodeApp = app;

//------------------------------------
// static 폴더 설정
//------------------------------------

//app.use(express.static('../../public'));
//app.use(express.static('../web/dist'));
function setStaticFolder(json: string = '') {
    console.log('* static 폴더 설정:');
    const folderMap = JSON.parse(json);

    for (const name in folderMap) {
        const pathString = folderMap[name];
        const prefix = name ? name : '/';

        pathString.split(',').forEach((folder='') => {

            folder = resolve(__dirname, folder.trim());

            if(prefix === '/'){
                app.use(express.static(folder));
            }else{
                app.use(prefix, express.static(folder));
            }
            console.log('[ %s ] : %s', prefix.padStart(10), folder);
        });
    }
}

//------------------------------------
// default response
//------------------------------------

function defaultResponse(req: Request, res: Response, next: NextFunction) {
    //const index = resolve('index.html');

    const html = `
<ul>
  <li><a href="/api/hello">shared 라이브러리 변수 사용 확인</li>
  <li><a href="/api/world">public 폴더의 이미지를 사용 (동적 import)</li>
  <li><a href="./debug">(*?/debug) 서버 콘솔에 로그 표시</li>
</ul>`;

    res.status(200).send(html);
}

//------------------------------------
// 서버 구동
//------------------------------------

function serverRun() {
    // 개발 환경에서는 Vite가 서버를 구동한다.
    if (!isProd) return;

    // production
    app.listen(PORT, () => {
        console.log('\x1b[44m%s\x1b[0m', 'API Server', `at http://localhost:${PORT}`);
    });
}

//------------------------------------
// 에러 핸들러
//------------------------------------

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500);
    res.render('error', {error: err});
}

//------------------------------------
// 디버깅용 코드 작업
//------------------------------------

function debug(req: Request, res: Response, next: NextFunction) {

    console.log('-----------------------------------');
    console.log('* cwd: ', process.cwd());
    console.log(`* __dirname: ${__dirname}`);

    console.log('* originalUrl: ', req.originalUrl);
    console.log('* body: ', req.body);
    console.log('* query: ', req.query);
    console.log('* params: ', req.params);

    next();
}