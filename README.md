# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more
information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will
remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right
into your project so you have full control over them. All of the commands except `eject` will still work, but they will
point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you
shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't
customize it when you are ready for it.

## Learn More

You can learn more in
the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved
here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved
here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved
here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved
here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved
here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved
here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

- [ ] 컨벤션
- [ ] 커밋메시지 룰
- [ ] pr template 설명
- [ ] git flow 전략 설명
- [ ] 브랜치 네이밍 규칙
- [ ] 이슈 등록 방법

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
