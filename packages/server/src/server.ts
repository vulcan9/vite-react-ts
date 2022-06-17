/**
 * ---------------------------------------------------------------------
 * Created by (pdi1066@naver.com) on 2022-06-14 0014.
 * ---------------------------------------------------------------------
 */

import express, {NextFunction, Request, Response} from 'express';
import router from './router';
import path from 'path';
import morgan from 'morgan';

// 개발 환경에서는 Vite가 환경 변수를 로드해서 세팅 해줌
// production 환경에서는 import.meta.env 사용
const env = import.meta.env;
console.log('* ENV: ', env);

const isProd = env.PROD;
//const HOST = env.HOST || '0.0.0.0';
const PORT = <number>(env.VITE_WWW_PORT || 3000);
const STATIC_FOLDER = (env.VITE_WWW_STATIC_FOLDER || '');
process.env.NODE_ENV = env.MODE;

console.log('* NODE_ENV: ', process.env.NODE_ENV);
console.log('* PORT: ', PORT);
console.log('* STATIC_FOLDER: ', STATIC_FOLDER);

const app = express();
if (isProd) app.use(morgan('dev'));

// for parsing application/json
app.use(express.json());
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}))

// 디버깅용 로그 코드 작업
if (!isProd) app.use('*?/debug', debug);

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
// default response
//------------------------------------

//app.use(express.static('../../public'));
//app.use(express.static('../web/dist'));
function setStaticFolder(pathString: string = '') {
    pathString.split(',').forEach((folder) => {
        folder = path.resolve(folder.trim());
        app.use(express.static(folder));
        //console.log('STATIC_FOLDER: ', folder);
    });
}

//------------------------------------
// default response
//------------------------------------

function defaultResponse(req: Request, res: Response, next: NextFunction) {
    //const index = path.resolve('index.html');
    res.status(200).send('success');
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
    console.log('* originalUrl: ', req.originalUrl);
    console.log('* body: ', req.body);
    console.log('* query: ', req.query);
    console.log('* params: ', req.params);

    next();
}