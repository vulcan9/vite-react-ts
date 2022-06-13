# workspace 테스트

```shell
npm init  #name : @ss/monorepo
npm i
```

두개의 하위 프로젝트를 생성함
```shell
npm init -w ./packages/shared  #name : @ss/shared
npm init -w ./packages/web     #name : @ss/web
```

`package.json` 파일에 `workspaces` 항목 생성됨
```
    "workspaces": [
        "packages\\shared",
        "packages\\web"
    ],
```

`npm i` 실행하면 `package-lock.json` 파일에 자동으로 심볼릭 링크가 생성됨
```
{
    "name": "@ss/monorepo",
    "version": "1.0.0",
    "lockfileVersion": 2,
    "requires": true,
    "packages": {
        "": {
            "name": "@ss/monorepo",
            "version": "1.0.0",
            "license": "ISC",
            "workspaces": [
                "packages\\shared",
                "packages\\web"
            ]
        },
        "node_modules/@ss/shared": {
            "resolved": "packages/shared",
            "link": true
        },
        "node_modules/@ss/web": {
            "resolved": "packages/web",
            "link": true
        },
        "packages/shared": {
            "name": "@ss/shared",
            "version": "1.0.0",
            "license": "ISC"
        },
        "packages/web": {
            "name": "@ss/web",
            "version": "1.0.0",
            "license": "ISC",
            "devDependencies": {}
        }
    },
    "dependencies": {
        "@ss/shared": {
            "version": "file:packages/shared"
        },
        "@ss/web": {
            "version": "file:packages/web"
        }
    }
}

```

워크스페이스내에 모듈을 추가
```shell
npm i -S react -w [패키지명]
npm i -S react -w @ss/web
```

`web/package.json` 파일에 `dependencies`은 기록되지만 `web/node_modules` 폴더는 생성되지 않음

#### 간단한 테스트
`shared`, `web` 패키지에 각각 `index.ts` 파일을 생성한 후 참조 가능한지 테스트
```js
// shared/index.ts
const hello = () => {
  console.log(`hello workspace shared!`);
};
module.exports = hello;

// web/index.ts
const hello = require('@ss/shared');
hello();
```

`web/package.json` 파일에 npm 명령 작성 후 실행
```
  "scripts": {
    "dev": "node index.ts"
  }
  
// npm run dev -w @ss/web
// 출력: hello workspace shared!
```
참고 : [npm-workspace-로-monorepo-구성](https://velog.io/@katanazero86/npm-workspace-로-monorepo-구성)

## Monorepo 구조 테스트

```
├── node_modules
|         
├── packages
|     ├── config (설정 파일)
|     |     
|     ├── shared (라이브러리)
|     |     
|     └── web (app)
|     |     ├── src
|     |     └── index.html
```

* `web` 프로젝트에서 `shared`(러이브러리) 폴더의 리소스를 즉시 사용 가능함
* 러이브러리 내용이 바뀔 경우 `web` 프로젝트에 바로 적용됨
* `web` 프로젝트 빌드할때 `shared` 소스 함께 번들링 됨

### `npm run dev` 명령에 따른 차이점
`process.cwd()`의 참조 경로가 달라짐

* `npm run dev` : `process.cwd()`가 `/` 임
```shell
# package.json
# "dev": "vite serve ./packages/web",
npm run dev

# http://localhost:3000/
# http://localhost:3000/packages/web/
# 둘다 서비스됨
```

* `run dev -w @ss/web` : `process.cwd()`가 `/packages/web/` 임
```shell
# packages/web/package.json
# "dev": "vite",
npm run dev -w @ss/web

# http://localhost:3000/
# http://localhost:3000/packages/web/
# 둘다 서비스됨
```

### Vite `base` 옵션에 따른 차이점
`run dev -w @ss/web` 명령으로 실행한 경우

* `vite.config.ts` 옵션 설정 안한 경우
```html
<!--dev: http://localhost:3000/(packages/web/)-->
<script type="module" src="/src/main.tsx"></script>
```

* `vite.config.ts` 옵션 설정한 경우
  - assets 경로에 prefix로 붙음
  - http://localhost:3000/packages/web/ 로 리다이렉팅 됨
```ts
// vite.config.ts
base: '/packages/web/'
//<!--dev: http://localhost:3000/packages/web/-->
//<script type="module" src="/packages/web/src/main.tsx"></script>
```
```ts
// vite.config.ts
base: './'
//<!--빌드된 결과는 assets 폴더에 있음-->
//<script type="module" src="./assets/index.~~~.js"></script>
```

참고 : [npm-ts-workspaces-example](https://github.com/Quramy/npm-ts-workspaces-example)

## Monorepo 구조에서 프로젝트 실행 방법  

> `vite.config.ts`에서 `base` 옵션을 설정한다.  
> * dev: `base` 지정 안함  
> * prod: `base: './'`  
>  
> `run dev -w @ss/web` 명령으로 실행한다.



## 라이브러리 모드 빌드 테스트

https://vitejs-kr.github.io/guide/build.html#library-mode

* `web`과 라이브러리 각각 독자적으로 빌드 (배포) 가능한지 확인





























