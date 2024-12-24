# 프로젝트

이 프로젝트는 넷플릭스와 유사한 애플리케이션을 React를 사용하여 만드는 것이 목적입니다.

빠른 속도와 편리한 사용성을 제공하는 것을 목표로 하고 있습니다.\
영화 포스터를 클릭하면 세부 정보 및 유튜브 트레일러을 볼 수 있습니다.\
또한 필터 검색과 검색창에 검색하는 별도의 기능을 제공합니다.

마음에 드는 영화 데이터는 Wishlist에 추가하여 관리할 수 있습니다.\
Wishlist에 추가한 영화는 사용자가 원하는 시기에 다시 볼 수 있도록 관리할 수 있습니다.

# 사용 기술 및 라이브러리

- React: 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리. 컴포넌트 기반 아키텍처와 상태 관리를 통해 유연하고 재사용 가능한 UI를 작성.
- TypeScript: JavaScript의 정적 타입 지원을 추가하여 코드의 안정성과 가독성을 향상.
- React Router: 라우팅 기능을 제공하여 SPA(Single Page Application)의 페이지 전환을 구현.
- Axios: HTTP 클라이언트로, TMDB API와의 통신을 효율적으로 처리.
- React Scripts: React 애플리케이션의 빌드 및 개발 환경 설정을 간소화.
- ESLint: 코드 품질을 유지하고 일관성을 확보하기 위한 린터.
- Cross-Env: 환경 변수를 OS 간에 호환되도록 설정.
- Prettier: 코드 포맷터로, 코드의 일관성을 유지하고 가독성을 향상.

# API

TMDB API를 사용하여 영화 데이터를 가져왔습니다.

[TMDB API](https://www.themoviedb.org/documentation/api)를 회원가입 시 비밀번호로 입력하면 영화 데이터 조회가 가능합니다.\
또한 TMDB API를 사용하기 위해서는 API Key가 필요합니다.\
API Key는 TMDB 사이트에서 발급받을 수 있습니다.

# 실행 방법

프로젝트를 실행하기 위해서는 먼저 아래의 명령어를 실행해야합니다.

### `npm install`

프로젝트 실행에 필요한 모듈을 설치합니다.<br>
node_modules 폴더가 생성되며, 이 폴더에는 프로젝트 실행에 필요한 모듈이 설치됩니다.

### `npm run start`

개발 모드로 프로젝트를 실행합니다.<br>
[http://localhost:3000](http://localhost:3000)로 접속하여 프로젝트를 확인할 수 있습니다.

추가적으로 아래의 명령어를 사용하여 프로젝트를 빌드할 수 있습니다.

### `npm run build`

프로덕션용으로 앱을 `build` 폴더에 빌드합니다.\
프로덕션 모드에서 React를 올바르게 번들링하고 최상의 성능을 위해 빌드를 최적화합니다.

빌드는 최소화되고 파일 이름에는 해시가 포함됩니다.\
이렇게 하면 앱이 배포될 준비가 끝났습니다.

자세한 내용은 [배포](https://facebook.github.io/create-react-app/docs/deployment) 섹션을 참조하세요.

# 코드 구조

```
src
├── App
│   ├── App.css
│   ├── App.tsx
│   ├── AppRoutes.css
│   └── AppRoutes.tsx
├── assets
│   ├── icons
│   └── images
│       └── placeholder.jpg
├── components
│   ├── Error
│   │   ├── ErrorComponent.css
│   │   └── ErrorComponent.tsx
│   ├── Header
│   │   ├── Header.css
│   │   └── Header.tsx
│   ├── MovieCard
│   │   ├── MovieCard.css
│   │   └── MovieCard.tsx
│   ├── MovieList
│   │   ├── MovieList.css
│   │   └── MovieList.tsx
│   ├── MovieModal
│   │   ├── MovieModal.css
│   │   └── MovieModal.tsx
│   ├── Pagination
│   │   ├── Pagination.css
│   │   └── Pagination.tsx
│   ├── Search
│   │   ├── SearchBar.css
│   │   ├── SearchBar.tsx
│   │   ├── SearchFilter.css
│   │   └── SearchFilter.tsx
│   └── common
│       ├── Button.css
│       ├── Button.tsx
│       ├── InputField.css
│       ├── InputField.tsx
│       ├── Loader.css
│       ├── Loader.tsx
│       ├── Modal.css
│       ├── Modal.tsx
│       ├── Toast.css
│       └── Toast.tsx
├── controllers
│   ├── AuthController.ts
│   ├── MovieController.ts
│   └── userPreferenceController.ts
├── hooks
│   ├── useInfiniteScroll.ts
│   ├── usePagination.ts
│   └── usePreference.ts
├── index.css
├── index.tsx
├── logo.svg
├── models
│   └── Movie.ts
├── react-app-env.d.ts
├── reportWebVitals.ts
├── services
│   ├── api
│   │   ├── EndPoints.ts
│   │   └── tmdbAPI.ts
│   ├── authService.ts
│   └── userPreferenceService.ts
├── setupTests.ts
├── styles
│   └── global.css
├── util
│   └── validators.ts
└── views
    ├── AuthView
    │   ├── AuthView.css
    │   └── SignIn.tsx
    ├── HomeView
    │   ├── HomeView.css
    │   └── HomeView.tsx
    ├── PopularView
    │   ├── PopularView.css
    │   └── PopularView.tsx
    ├── SearchView
    │   ├── SearchView.css
    │   └── SearchView.tsx
    └── WishlistView
        ├── WishlistView.css
        └── WishlistView.tsx
```

# Code Convention

Prettier를 사용하여 코드 컨벤션을 지키도록 하였습니다.

- [Prettier](https://prettier.io/)
- [Prettier Config](https://prettier.io/docs/en/configuration.html)
- [Prettier Config Options](https://prettier.io/docs/en/options.html)

# Commit Message Rules

[Git Commit Message Conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153) 을 참고하여 커밋 메시지 작성

- 제목과 본문을 빈 행으로 구분한다
- 제목을 50글자 내로 제한
- 제목 첫 글자는 대문자로 작성
- 제목 끝에 마침표 넣지 않기
- 제목은 명령조로 작성
- 본문은 72글자 마다 줄 바꾸기
- 본문은 어떻게 보다는 무엇과 왜를 설명한다
- 본문에 여러줄 메시지는 "-"로 구분

# Pull Request Template

Pull Request를 작성할 때 아래의 템플릿을 사용하여 작성

```
- 제목 : feat(issue 번호): 기능명
  ex) feat(17): pull request template 작성
  (확인 후 지워주세요)

## 🔎 작업 내용

- 어떤 부분이
- 구현되었는지 설명해주세요

  <br/>

## 이미지 첨부

- 이미지가 없으면 이 부분을 제거해주세요
  <br/>
  <img src="파일주소" width="50%" height="50%"/>
  <br/>

## 🔧 앞으로의 과제

- 다음에 할 일을
- 적어주세요

  <br/>

## ➕ 이슈 링크

- [레포 이름 #이슈번호](이슈 주소)

<br/>
```

# Git Flow 전략

Git Flow 전략을 사용하여 브랜치를 관리하였습니다.

- main 브랜치: 제품으로 출시될 수 있는 브랜치
- develop 브랜치: 다음 출시 버전을 개발하는 브랜치
- feature 브랜치: 기능을 개발하는 브랜치
- release 브랜치: 이번 출시 버전을 준비하는 브랜치
- hotfix 브랜치: 출시 버전에서 발생한 버그를 수정 하는 브랜치

feature 브랜치는 develop 브랜치에서 분기하고, develop 브랜치에 병합합니다.
release 브랜치는 develop 브랜치에서 분기하고, develop 브랜치와 main 브랜치에 병합합니다.
hotfix 브랜치는 main 브랜치에서 분기하고, develop 브랜치와 main 브랜치에 병합합니다.

# Branch Naming Rule

브랜치 네이밍 규칙을 지키도록 하였습니다.

- feature 브랜치: feature/기능명
- release 브랜치: release/버전
- hotfix 브랜치: hotfix/버전

# Issue Register

이슈를 등록할 때 아래의 템플릿을 사용하여 작성하였습니다. 이슈를 등록할 때는 해당 레포지토리의 이슈 탭에서 등록해주세요.
또한 이슈는 해야할 일을 관리하고 tracking하기 위해서 작성되었습니다.

```
## 📄 설명

## ✔️ To-Do
- [ ] 할 일1
- [ ] 할 일2

## ✍️ 기타
기타 사항이 있다면 작성해주세요.

```
