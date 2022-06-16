# 프론트 엔드 (Vite + React + TypeScript)

## 프로젝트 생성

```shell
npm create vite
# react > react-ts 선택하여 프로젝트 생성
# 다음 명령과 같음
# npm create vite <프로젝트 이름>
# create-vite@2.9.10

cd <프로젝트 이름>
npm install # 의존성 모듈 업데이트

npm run dev
# 디버깅 서버 구동됨
# vite v2.9.10 dev server running at:
# > Local: http://localhost:3000/
# > Network: use `--host` to expose
```
참고  
`create-vite` - Scaffolding Your First Vite Project.

### package.json

```json
{
    "scripts": {
        "dev": "vite",
        "build": "tsc && vite build",
        "preview": "vite preview"
    },
    "dependencies": {
        "react": "^18.0.0",
        "react-dom": "^18.0.0"
    },
    "devDependencies": {
        "@types/react": "^18.0.0",
        "@types/react-dom": "^18.0.0",
        "@vitejs/plugin-react": "^1.3.0",
        "typescript": "^4.6.3",
        "vite": "^2.9.9"
    }
}
```

`Vite` + `Typescript` + `React` 설치된 프로젝트가 생성됨

### vite.config.ts

```ts
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()]
})
```

### ts.config.json

```json
{
    "compilerOptions": {
        "composite": true,
        "module": "esnext",
        "moduleResolution": "node"
    },
    "include": [
        "vite.config.ts"
    ]
}
```

### type 설치

```shell
npm i -D @types/node
```

## 프로젝트 실행해 보기

`preview` 명령으로 실행되는 서버의 root 경로는 `dist` 폴더임

```shell
npm run build

# vite preview --port 4173
npm run preview
# 이후 localhost:4173/ 에서 빌드 결과 확인
```

빌드할 때 `base` 옵션을 지정한 경우에는 `preview` 할 수없음
- 프로젝트 폴더 아래 `dist` 폴더로 preview 서버 root 가 설정되기 때문임

```
// 예: vite.config.ts
{
  ...
  // assets 폴더의 참조 경로에 추가됨 (/assets --> /web/assets)
  base: '/web/',
  
  // outDir 폴더에 빌드 결과물 생성
  build: {
    outDir: 'dist/web/'
  }
}
```

이후 build 및 preview 명령을 실행하면

```shell
# 빌드 경과물 위치 : dist/web/...
# localhost:4173/web/ 에서 결과 확인
```

