# Vite - 환경 변수와 모드

[정적 웹 페이지로 배포하기](https://vitejs-kr.github.io/guide/static-deploy.html)

* 로컬에서 앱 테스트하기
* GitHub Pages에 배포
* GitHub Pages 그리고 Travis CI
* GitLab Pages 그리고 GitLab CI
* Google Firebase
* Surge
* Heroku
* Vercel
* Azure Static Web Apps

## Vite의 환경 변수와 모드

Vite는 `import.meta.env` 객체를 이용해 환경 변수에 접근

* `import.meta.env.MODE`: {string} 현재 앱이 동작하고 있는 모드입니다.
* `import.meta.env.BASE_URL`: {string} 앱이 제공되는 베이스 URL이며, 이 값은 base 설정에 의해 결정됩니다.
* `import.meta.env.PROD`: {boolean} 앱이 프로덕션에서 실행 중인지 여부입니다.
* `import.meta.env.DEV`: {boolean} 앱이 개발 환경에서 실행 중인지 여부 (항상 import.meta.env.PROD와 반대되는 값)

프로덕션에서는 환경 변수가 모두 정적으로 교체됩니다.  
따라서 항상 환경 변수는 정적으로 참조해야만 하며, `import.meta.env[key]`와 같은 동적 참조는 작동하지 않음

### .env 파일들

환경 변수가 저장된 디렉터리 내 아래의 파일에서 환경 변수를 가져옴
```
.env                # 모든 상황에서 사용될 환경 변수
.env.local          # 모든 상황에서 사용되나, 로컬 개발 환경에서만 사용될(Git에 의해 무시될) 환경 변수
.env.[mode]         # 특정 모드에서만 사용될 환경 변수
.env.[mode].local   # 특정 모드에서만 사용되나, 로컬 개발 환경에서만 사용될(Git에 의해 무시될) 환경 변수
```

### 환경 변수 우선순위

Vite가 실행될 때 이미 존재하던 환경 변수는 가장 높은 우선 순위를 가지며, .env 파일로 인해 덮어씌워지지 않음
```
예)  VITE_SOME_KEY=123 vite build 
```

* `.env` 파일은 Vite가 시작될 때 가져와짐. 따라서 파일을 변경했다면 서버를 재시작 해주어야 함.
* 설정된 환경 변수는 import.meta.env 객체를 통해 문자열 형태로 접근이 가능
* Vite에서 접근 가능한 환경 변수는 일반 환경 변수와 구분을 위해 VITE_ 라는 접두사를 붙여 나타냄
```
# 환경 변수를 정의
DB_PASSWORD=foobar
VITE_SOME_KEY=123
# VITE_SOME_KEY 변수만이 import.meta.env.VITE_SOME_KEY로 접근이 가능
```
* 환경 변수에 대한 접미사(Prefix)를 커스터마이즈 하고자 한다면, `envPrefix` 옵션을 참고

### 보안 권고 사항

> .env.*.local 파일은 오로지 로컬에서만 접근이 가능한 파일이며,  
> 데이터베이스 비밀번호와 같은 민감한 정보를 이 곳에 저장하도록 합니다.  
> 또한 .gitignore 파일에 *.local 파일을 명시해 Git에 체크인되는 것을 방지하도록 합니다.

> Vite 소스 코드에 노출되는 모든 환경 변수는 번들링 시 포함되게 됩니다.  
> 따라서, VITE_* 환경 변수에는 민감한 정보들이 포함되어서는 안됩니다.

### [TypeScript를 위한 인텔리센스](https://vitejs-kr.github.io/guide/env-and-mode.html#intellisense-for-typescript)


## 모드

`dev` 명령으로 실행되는 개발 서버는 `development` 모드로 동작하고,  
`build` 명령으로 실행되는 경우에는 `production` 모드로 동작함

vite build 명령을 실행하게 되면 .env.production에 정의된 환경 변수를 불러오게 됩니다.
```
# .env.production
VITE_APP_TITLE=My App
```

### "staging" 이라는 모드가 필요하다면?

`--mode` 옵션을 전달해 사용할 모드를 지정
"staging" 모드로 서버를 동작(배포)하고 싶다면 아래와 같이 명령을 실행
```
vite build --mode staging
```
"staging" 모드에서 사용될 환경 변수는 .env.staging 파일에 정의
```
# .env.staging
NODE_ENV=production
VITE_APP_TITLE=My App (staging)

# import.meta.env.VITE_APP_TITLE 환경 변수를 통해 참조
```

















