# workspace 구성


### Vite Monorepo 지원함
Vite는 모노리포 설정을 처리하도록 설계되었으며, 사용자가 모노리포기반의 Yarn, Yarn 2 그리고 PNPM을 성공적으로 사용하도록 합니다.  

* [Vite 프로젝트 미리보기](https://vite.new/react-ts)
* [첫 Vite 프로젝트 만들어보기](https://vitejs-kr.github.io/guide/#scaffolding-your-first-vite-project)
* [vite 리소스](https://github.com/vitejs/awesome-vite)

```
yarn create vite <my-app --template react-ts>
```

[플러그인 사용하기](https://vitejs-kr.github.io/guide/using-plugins.html) : 개발 서버나 SSR과 같은 기능들을 확장  
[플러그인을 찾는 방법](https://vitejs-kr.github.io/guide/using-plugins.html#finding-plugins)  
```js
// @vitejs/plugin-legacy 사용하고자 할때
// $ npm add -D @vitejs/plugin-legacy

// vite.config.js
import legacy from '@vitejs/plugin-legacy'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ]
})
```





모노레포 구성 가능
CSS 전처리
Typescript 변환
번들 패키징
web 서버, electron 빌드, 모바일 빌드

storybook,
LESS (SCSS: @extend등 문법 작성할게 많음)
unit test, e2e

CRA에서 시작
CRUD, TODO APP
서버 요청/응답 : MobX, ReactiveX, Axios







- [Yarn, Lerna, Nx, Turborepo workspace 생성하기](https://d2.naver.com/helloworld/7553804#ch3)
- [모노레포(MonoRepo) 구조를 활용한 프론트엔드 개발](https://kmoon.tistory.com/36?category=705949)






