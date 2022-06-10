# Vite - import.meta 객체

## Glob Import : import.meta.glob

* `import.meta.glob` 함수를 이용해 여러 모듈을 한 번에 가져올 수 있도록 지원

```js
const modules = import.meta.glob('./dir/*.js')

// 위 코드는 아래와 같이 변환
// Vite를 통해 변환된 코드
const modules = {
    './dir/foo.js': () => import('./dir/foo.js'),
    './dir/bar.js': () => import('./dir/bar.js')
}

// modules를 순회하여 각 모듈에 접근
for (const path in modules) {
    modules[path]().then((mod) => {
        console.log(path, mod)
    })
}
```

`import.meta.glob` 함수를 이용하면, 동적(Dynamic) Import를 이용해 파일의 청크를 가져옴.  
만약 동적으로 Import하는 것이 아니라 직접 모듈을 가져오고자 한다면, 두 번 째 인자로 `{ eager: true }` 객체를 전달

```js
const modules = import.meta.glob('./dir/*.js', { eager: true })

// 위 코드는 아래와 같이 변환
// Vite를 통해 변환된 코드
import * as __glob__0_0 from './dir/foo.js'
import * as __glob__0_1 from './dir/bar.js'
const modules = {
    './dir/foo.js': __glob__0_0,
    './dir/bar.js': __glob__0_1
}
```

#### Glob Import As
import.meta.glob 역시 문자열 형태로 에셋 가져오기 기능과 유사하게 파일을 가져올 수 있음

```js
// URL을 통해 에셋을 가져오고자 한다면 { as: 'url' }을 전달
const modules = import.meta.glob('./dir/*.js', { as: 'raw' })

// Vite를 통해 변환된 코드
const modules = {
    './dir/foo.js': 'export default "foo"\n',
    './dir/bar.js': 'export default "bar"\n'
}
```

#### 네거티브 Glob 패턴
* `!` 접두사를 이용 첫 번째 인수에 제외할 네거티브 Glob 패턴을 추가
```js
const modules = import.meta.glob(['./dir/*.js', '!**/bar.js'])

// 아래는 Vite에 의해 생성되는 코드입니다.
const modules = {
    './dir/foo.js': () => import('./dir/foo.js')
}
```

#### Named Imports

import 옵션을 이용해 모듈의 일부만 가져올 수도 있음
```js
const modules = import.meta.glob('./dir/*.js', { import: 'setup' })

// 아래는 Vite에 의해 생성되는 코드입니다.
const modules = {
    './dir/foo.js': () => import('./dir/foo.js').then((m) => m.setup),
    './dir/bar.js': () => import('./dir/bar.js').then((m) => m.setup)
}
```

eager와 같이 사용하면 모듈에 대한 트리 셰이킹도 가능
```js
const modules = import.meta.glob('./dir/*.js', { import: 'setup', eager: true })

// 아래는 Vite에 의해 생성되는 코드입니다:
import { setup as __glob__0_0 } from './dir/foo.js'
import { setup as __glob__0_1 } from './dir/bar.js'
const modules = {
    './dir/foo.js': __glob__0_0,
    './dir/bar.js': __glob__0_1
}
```

`default export`를 가져오고자 하는 경우에는 import 옵션 값을 default로 설정
```js
const modules = import.meta.glob('./dir/*.js', { import: 'default', eager: true })

// 아래는 Vite에 의해 생성되는 코드입니다:
import __glob__0_0 from './dir/foo.js'
import __glob__0_1 from './dir/bar.js'
const modules = {
    './dir/foo.js': __glob__0_0,
    './dir/bar.js': __glob__0_1
}
```

`query` 옵션은 다른 모듈을 가져올 때 사용하는 커스텀 쿼리를 지정
```js
const modules = import.meta.glob('./dir/*.js', {
  query: { foo: 'bar', bar: true }
})

// 아래는 Vite에 의해 생성되는 코드입니다:
const modules = {
    './dir/foo.js': () =>
        import('./dir/foo.js?foo=bar&bar=true').then((m) => m.setup),
    './dir/bar.js': () =>
        import('./dir/bar.js?foo=bar&bar=true').then((m) => m.setup)
}
```

### Glob Import 유의 사항

* 이 기능들은 Vite에서 제공하는 기능임 (ES 표준이나 웹 브라우저에서 제공하는 기능이 아님)
* Glob 패턴 사용 시, `상대 경로(./)` 또는 `절대 경로(/)` 또는 `resolve.alias` 옵션을 통해 별칭으로 지정된 경로 만을 이용
* Glob 패턴 매칭은 `fast-glob`을 이용 ([지원하는 Glob 패턴 목록](https://github.com/mrmlnc/fast-glob#pattern-syntax))
* `import.meta.glob`으로 전달되는 모든 인자는 리터럴 값을 전달해야 함. 변수나 표현식을 사용할 수 없음

### 동적 Import

Glob Import와 마찬가지로 Vite는 변수를 사용한 동적인 Import도 지원
```js
const module = await import(`./dir/${file}.js`)
```
변수 file은 깊이가 1인 파일에 대해서만 나타낼 수 있음. (file이 `foo/bar`인 경우에는 Import가 실패)


-------------------------------------------------------------------------------


## new URL(url, import.meta.url)

* 네이티브 ESM의 API 중 하나인 import.meta.url은 현재 모듈의 URL을 보여주는 기능
* URL 생성자와 함께 사용하면, 정적 에셋의 전제 URL을 확인할 수 있음
```JS
const imgUrl = new URL('./img.png', import.meta.url).href;
document.getElementById('hero-img').src = imgUrl;
```
템플릿 리터럴을 이용해 동적으로 생성되는 URL에서도 동작
```JS
function getImageUrl(name) {
  return new URL(`./dir/${name}.png`, import.meta.url).href;
}
```

* SSR과 함께 사용하지 마세요!
import.meta.url은 브라우저와 Node.js 간 서로 다른 의미를 갖기 때문에, 
이 패턴은 서버-사이드 렌더링(SSR)에 Vite를 사용하는 경우 동작하지 않음.

* `target`은 `es2020`보다 높아야 해요!
이 패턴은 build-target 또는 optimizedeps.esbuildoptions.target 설정 값이 es2020 미만이면 동작하지 않음.






































