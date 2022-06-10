# Vite - 빌드 모드

### 프로덕션 버전으로 빌드

* `vite build` 명령을 실행
* `<root>/index.html` 파일이 빌드를 위한 진입점(Entry point)으로 사용
* 정적 호스팅을 위한 형태로 진행
* [GitHub Pages와 같은 정적 호스팅 서비스를 위한 빌드 방법](https://vitejs-kr.github.io/guide/static-deploy.html)

### 지원 브라우저
* 빌드된 프로덕션 버전의 경우 모던 JavaScript를 지원하는 브라우저에서 동작한다고 가정
* 네이티브 ES 모듈, 네이티브 ESM의 동적 Import, 그리고 `import.meta`를 지원하는 브라우저를 타깃

  - Chrome >=87
  - Firefox >=78
  - Safari >=13
  - Edge >=88

* 폴리필은 지원하지 않음 
* 레거시 브라우저의 경우 `@vitejs/plugin-legacy` 플러그인을 이용
  - 레거시 청크는 브라우저가 ESM을 지원하지 않는 경우에만 사용됨
 
### 빌드 커스터마이즈

* [빌드 옵션](https://vitejs-kr.github.io/config/#server-fs-deny)
* `Rollup` 옵션을 build.rollupOptions에 명시해 사용이 가능
```js
// vite.config.js
module.exports = defineConfig({
    build: {
        rollupOptions: {
            // https://rollupjs.org/guide/en/#big-list-of-options
        }
    }
})
```

### 파일 변경 시 다시 빌드

Rollup Watcher를 활성화
```
vite build --watch
```
또는, `build.watch` 옵션에서 `WatcherOptions`를 직접 명시
```js
// vite.config.js
module.exports = defineConfig({
    build: {
        watch: {
            // https://rollupjs.org/guide/en/#watch-options
        }
    }
})
```
`--watch` 플래그가 활성화된 상태에서 `vite.config.js` 또는 번들링 된 파일을 변경하게 되면 다시 빌드가 시작됨.


### Multi-Page App

빌드 시에는, 사용자가 접근할 수 있는 모든 `.html` 파일에 대해 아래와 같이 빌드 진입점이라 명시해 줘야함
```js
// vite.config.js
const { resolve } = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                nested: resolve(__dirname, 'nested/index.html')
            }
        }
    }
})
```

## 라이브러리 모드

* 라이브러리 배포 시점에서, `build.lib` [설정 옵션](https://vitejs-kr.github.io/config/#build-lib)을 이용
* 라이브러리에 포함하지 않을 디펜던시를 명시할 수도 있음

```js
// vite.config.js
const path = require('path')
const {defineConfig} = require('vite')

module.exports = defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'lib/main.js'),
            name: 'MyLib',
            // 적절한 확장자가 추가됩니다.
            fileName: 'my-lib'
        },
        rollupOptions: {
            // 라이브러리에 포함하지 않을 디펜던시를 명시해주세요
            external: ['react'],
            output: {
                // 라이브러리 외부에 존재하는 디펜던시를 위해
                // UMD(Universal Module Definition) 번들링 시 사용될 전역 변수를 명시할 수도 있습니다.
                globals: {
                    react: 'React'
                }
            }
        }
    }
})
```

`vite build` 명령을 실행하면, `es` 및 `umd` 두 가지의 포맷으로 번들링 과정이 진행
```
$ vite build
building for production...
[write] my-lib.mjs 0.08kb, brotli: 0.07kb
[write] my-lib.umd.js 0.30kb, brotli: 0.16kb
```

`package.json`에는 아래와 같이 사용할 라이브러리를 명시
```json
{
  "name": "my-lib",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.js",
  "module": "./dist/my-lib.mjs",
  "exports": {
    ".": {
      "import": "./dist/my-lib.mjs",
      "require": "./dist/my-lib.umd.js"
    }
  }
}
```


