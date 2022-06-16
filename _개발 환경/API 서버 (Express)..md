# API 서버 (Express)

```shell
npm init -w packages/server
npm i -S express nodemon -w @ss/server
```

[`nodemon`](https://www.npmjs.com/package/nodemon) : 개발시 변경사항을 실시간으로 업데이트 해주기 위한 모듈

## 서버 동작 테스트

`server/packages.json`
```
  "scripts": {
    "dev": "nodemon server.ts",
    "server": "nodemon server.ts"
  }
```

`server/server.ts`
```js
const path = require('path');
const express = require('express');
const router = require('./router');

const {PORT = 3001} = process.env;

const app = express();

// Middleware that parses json and looks at requests where the Content-Type header matches the type option.
app.use(express.json());

// Serve API requests from the router
app.use('/api', router);

// Serve storybook production bundle
// app.use('/storybook', express.static('dist/storybook'));

// Serve app production bundle
app.use(express.static('../web/dist'));

// Handle client routing, return all requests to the app
app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../web/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
```

`server/router.js`
```js
const express = require('express');

const router = express.Router();

router.get('/hello', async (_req, res) => {
    res.status(200).json({ message: 'Hello World!' });
});

module.exports = router;
```

실행 테스트
```shell
npm run dev -w @ss/server

# 브라우저에서 http://localhost:3001 접속하면
# html 출력 : web 프로젝트에서 빌드했던(packages/web/dist 폴더) index.html 나옴
# (dist 폴더가 없으면 먼저 web 프로젝트를 빌드해 줘야함)

# 브라우저에서 http://localhost:3001/api/hello 접속하면
# 문자열 출력됨 : { message: 'Hello World!' }
```


## 프로젝트에 typescript 사용 설정

이부분은 참고용으로 기록함 (vite를 사용할 것이므로...)  
참고 [타입스크립트(typescript) 프로젝트 세팅하기](https://elvanov.com/2524)

```shell
npm i -D typescript @types/express @types/node -w @ss/server
npm i -D ts-node-dev tsconfig-paths -w @ss/server
```
`ts-node`: 사전 컴파일 없이 Node.js에서 TypeScript를 직접 실행

`server/tsconfig.json`
```
{
    "extends": "@ss/config/tsconfig.json",
    "compilerOptions": {
        "target": "es6",
        "module": "commonjs",
        "esModuleInterop": true,
        "noEmit": false,

        "rootDir": "./src",
        "outDir": "./dist",
    },
    "include": [
        "src"
    ]
}

// noEmit: true 이면 tsc 빌드 결과물이(dist 폴더) 생성되지 않음
```

`server/src/server.ts`
```ts
import express, {NextFunction, Request, Response} from 'express';
import router from './router';
import path from 'path';
import {Express} from "express";

const {PORT = 3001} = process.env;

const app: Express = express();

// Middleware that parses json and looks at requests where the Content-Type header matches the type option.
app.use(express.json());

// Serve API requests from the router
app.use('/api', router);

// Serve storybook production bundle
// app.use('/storybook', express.static('dist/storybook'));

// Serve app production bundle
app.use(express.static('../web/dist'));

// 기본 에러 처리
app.use(errorHandler);

// Handle client routing, return all requests to the app
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../web/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

//export const handler = app;

function errorHandler(err:any, req:Request, res:Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render('error', { error: err });
}
```

`server/src/router.js`
```ts
import express, {NextFunction, Request, Response} from 'express';
import {Router} from "express-serve-static-core";

const router: Router = express.Router();

// http://localhost:3001/api/hello ==> {"message":"Hello World!"}
router.get('/hello', async (_req: Request, res:Response, next: NextFunction) => {
  res.status(200).json({ message: 'Hello World!!!!!~~~' });
});

// module.exports = router;
export default router;
```

## 프로젝트에 vite / typescript 사용 설정

위와 같이 typescript 기반으로 프로젝트가 구성되어 있다면 Vite로 작업이 가능하도록 수정해 보자  
다음 세가지 방법을 찾았는데 `vite-plugin-node`를 사용하기로 결정했음

[server.middlewareMode](https://vitejs-kr.github.io/config/server-options.html#server-middlewaremode)
* 미들웨어로 동작하므로 SSR 구현이 가능함
* Vite를 프로덕션 환경에서 분리 (개발 환경에서만 관여)
* [서버 측 렌더링 (SSR)](https://vitejs-kr.github.io/guide/ssr.html)

[vite-plugin-node](https://github.com/axe-me/vite-plugin-node)
* vite를 노드 개발 서버로 사용할 수 있는 vite 플러그인
* vite 개발 서버 대신 `appPath`에 설정된 서버를 구동시켜줌
* 따라서 서버에 작성된 (router 같은)코드가 그대로 동작함
* vite 개발환경이므로 shared 프로젝트의 코드도 바로 사용 가능하고 서버 build 에도 코드가 포함됨
* 정적 리소스는 배포에 포함 안됨
* `서버 개발에 적합`

[vite-plugin-mix](https://github.com/egoist/vite-plugin-mix)
* Vite 앱에 백엔드 API 추가
* 서버 개발이 필요없는 api 제공 용도로 간단하게 사용할 수 있음
* `client 개발 환경 구성에 적합`

> 정적 리소스는 배포(dist 폴더)에 포함되지 않으므로 직접 복사해 줘야함
> `ts-node-dev` 를 사용할 수도 있으나 빌드된 코드에서 동작도 확인하면서 개발하는 편이 좋을것 같아 vite 플러그인을 사용함

```shell
npm i -D vite-plugin-node -w @ss/server
```

> 배포할때 static 폴더로 지정되 있는 경로에 주의할것
> `.env.pro` 파일에 `VITE_WWW_STATIC_FOLDER` 경로 확인 필요함



