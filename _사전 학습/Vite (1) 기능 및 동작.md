# Vite - 기능 및 동작

[지원하는 기능들](https://vitejs-kr.github.io/guide/features.html#client-types)

* 기본적으로 vite는 여타 정적 파일 서버와 크게 다르지 않음
  - vite는 네이티브 ESM 말고도 기존 번들러에서 제공하던 기능을 대부분 지원한다는 차이점이 있음


* `index.html` 파일이 앱의 진입점
  - index.html 파일을 소스 코드이자 JavaScript 모듈 그래프를 구성하는 요소 중 하나로 취급
  - 인라인으로 작성된 `<script>`, `<link href>` 역시 Vite에서 취급이 가능


* Vite는 정적(Static) HTTP 서버와 비슷하게 "루트 디렉터리"라는 개념을 갖고 있음. (`<root>`)
  - 이는 Absolute URL을 프로젝트 루트를 가리키게끔 함으로써 일반적인 정적 파일 서버와 동일하게 코드를 작성 가능
  - 프로젝트 루트 외부에서도 디펜던시를 가져올 수 있게끔 구현
  - 이를 이용하면 모노리포 구성 등 다양한 작업이 가능


* 여러 `.html` 파일을 앱의 진입점으로 하는 `Multi-page apps`를 지원


* Vite CLI와 함께 --port, --https와 같은 옵션을 사용
  - 모든 CLI 옵션 : vite가 설치된 프로젝트 안에서 `npx vite --help` 명령을 실행


* 프로젝트 루트 지정
  - 개발 서버를 시작할 때 현재 위치해 있는 디렉터리를 프로젝트 루트로 가정하고 동작
  - 특정 디렉터리를 지정해 프로젝트 루트로써 동작하게끔 하고 싶다면
    ```
    vite serve some/sub/dir
    ```


* Vite의 개발 서버는 모든 코드를 네이티브 ESM으로 가져오게 됨 (Pre-bundling)
  - 디펜던시 사전 번들링 기능은 개발 모드에서만 적용되며,
    esbuild를 이용해 디펜던시를 ESM으로 변환합니다.  
    프로덕션 빌드의 경우, 이 대신 @rollup/plugin-commonjs가 대신 사용됩니다.
  - 첫 번째 스캐닝 시 모든 디펜던시를 스캔하지 않으며, 
  오로지 브라우저가 요청했을 때에만 해당 디펜던시를 변환해 가져오는 방식으로 동작


* 디펜던시는 반드시 캐시됨
  - 캐시 새로고침 : 디펜던시를 다시 번들링하는 `--force` 옵션과 함께 Vite의 개발 서버를 재시작
  - 서버가 이미 시작된 이후에 캐시되지 않은 새로운 디펜던시가 추가되는 경우라면,
    vite는 디펜던시 번들링 과정을 재시작하고 이후 해당 페이지를 다시 불러옴
  - 번들링을 다시하는 경우
    + `package.json` 내 `dependencies` 리스트가 변경되었을 때
    + `package-lock.json`, `yarn.lock` 또는 `pnpm-lock.yaml` 파일과 같은 패키지 매니저의 Lock 파일이 변경되었을 때
    + `vite.config.js`와 관련되어 있는 필드가 변경되었을 때
  - 강제 번들링 다시 시작
    + 개발 서버를 `--force` 옵션과 함께 시작하거나 
    + `node_modules/.vite` 디렉터리를 삭제


* 모노리포 디펜던시
  - 디펜던시가 node_modules에 존재하지 않더라도 스스로 탐색하여 이를 소스 코드로 가져올 수 있지만, 
  이를 번들로 묶지는 않음
  - 서로 관련된 리포지터리에 중복된 디펜던시가 많은 경우, 이를 하나로 통합하여 관리할 수 있다는 장점
  - 이를 위해서는 연결된 디펜던시가 ESM 형태로 내보내져야 함
  - 만약 그렇지 않다면, 해당되는 디펜던시들을 `optimizeDeps.include`와 `build.commonjsOptions.include` 설정에 추가
  ```js
  export default defineConfig({
     optimizeDeps: {
        include: ['linked-dep']
     },
     build: {
        commonjsOptions: {
           include: [/linked-dep/, /node_modules/]
        }
     }
  })
  // 설정 값 변경 이후 --force 플래그를 이용해 개발 서버를 다시 시작
  ```

### Typescript

* `.ts` 파일에 대한 컴파일링 및 Import 역시 지원
* `.ts` 파일에 대한 타입 체킹 (`tsc --noEmit`: 컴파일링 없이 타입 체킹만을 수행하는 옵션)
* 소스 코드로 변환 작업이 tsc 대비 약 20~30배 정도 빠른 퍼포먼스
* 타입만을 가져오는 경우 잘못 번들링이 될 수 있으며,
  이는 [타입 전용 Imports와 Exports](https://www.typescriptlang.org/ko/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export)를
  사용하여 이 문제를 우회

* [타입스크립트 컴파일러 옵션](https://vitejs-kr.github.io/guide/features.html#typescript-compiler-options)
    - `tsconfig.json` 파일 내 `compilerOptions` 설정들의 값을 조작할 때는 특별한 주의가 필요
* Client Types  
  Node.js API 기반의 타입 시스템을 차용하고 있으므로
  Client-side의 환경을 위해 Shim을 구성하고자 한다면 `d.ts` 선언 파일을 추가

* `.jsx`와 `.tsx` 역시 사용이 가능

### CSS

* `.css` 파일을 Import 할 때, 기본적으로 HMR을 위해 `<style>` 태그로 변환되어 불러와지게 됨
```js
import style from './style.css'
console.log(style) // 정의한 CSS를 문자열로 가져옵니다.
```
* `postcss-import`를 이용해 CSS의 `@import`를 처리함
* `url()`로 참조되는 모든 리소스들(다른 디렉터리에 존재한다 해도)에 대해 별다른 설정 없이 자동으로 Base를 재정의(Rebasing)
* 별칭을 이용한 `@import`도 지원하며, URL 재정의나 별칭은 CSS 말고도 `Sass`와 `Less`에서도 사용이 가능
* Sass나 Less에서의 @import 별칭 또한 Vite에서 사용이 가능
* 전처리된 CSS 역시 style.module.scss와 같이 CSS 모듈처럼 사용이 가능


### 정적 에셋

[정적 에셋 핸들링하기](https://vitejs-kr.github.io/guide/assets.html)

* 정적 에셋을 Import 하는 경우, 이에 대한 Public URL이 반환
```js
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

* URL 쿼리를 이용해 에셋을 가져올 때 어떻게 이를 가져올 것인지 명시
```js
// URL로 에셋 가져오기
import assetAsURL from './asset.js?url'
// String 타입으로 에셋 가져오기
import assetAsString from './shader.glsl?raw'
// 웹 워커 가져오기
import Worker from './worker.js?worker'
// Base64 포맷의 문자열 형태로 웹 워커 가져오기
import InlineWorker from './worker.js?worker&inline'
```

### JSON
JSON 파일은 바로 Import가 가능. 가져올 필드도 지정 가능
```js
// 객체 형태로 가져오기
import json from './example.json'
// 필드를 지정해 가져오기 (트리-쉐이킹 됩니다.)
import { field } from './example.json'
```

-------------------------------------------------------------------------------

## public 디렉터리

* 이 곳에 위치한 에셋은 개발 시에 `/` 경로에, 배포 시에는 `dist` 디렉터리에 위치하게 됨.
  - 소스 코드에서 참조되지 않는 에셋
  - 해싱 없이 항상 같은 이름을 갖는 에셋
  - URL을 얻기 위해 굳이 import 할 필요 없는 에셋


* `<root>/public` 디렉터리가 아닌 다른 디렉터리를 사용하고자 하는 경우, `publicDir` 옵션을 이용


* public 디렉터리에 위치해 있는 에셋을 가져오고자 하는 경우,
  항상 루트를 기준으로 하는 절대 경로로 가져와야만 함.  
  (`public/icon.png` 에셋은 소스 코드에서 `/icon.png`으로 접근이 가능합니다.)

* public 디렉터리에 위치한 에셋은 JavaScript 코드로 가져올 수 없음.

### Public Base Path : import.meta.env.BASE_URL

* base 설정을 이용해 프로젝트의 루트가 될 디렉터리를 명시해 줄 수 있음
* 커맨드 라인에서도 지정이 가능
```
vite build --base=/my/public/path
```
* `JS(import)`, `CSS(url())`, 그리고 `.html` 파일에서 참조되는 에셋 파일의 URL들은 
빌드 시 이 Base Path를 기준으로 가져올 수 있도록 자동으로 맞춰지게 됨

* 만약 동적으로 에셋의 URL을 생성해야 하는 경우라면, `import.meta.env.BASE_URL`을 이용
* 이 상수는 빌드 시 치환되는 방식이므로 `import.meta.env['BASE_URL']`과 같은 경우 사용할 수 없음






































