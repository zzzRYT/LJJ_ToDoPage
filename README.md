# 글로벌널리지 프론트엔드 개발자 코딩과제

**Author: 이재진**

**Github: [zzzRYT](https://github.com/zzzryt)**

## 바로가기

- [요구사항](#요구사항)
- [기술 스택](#기술-스택)
- [커밋 컨벤션](#커밋-컨벤션)
- [Getting Started](#시작하기)
- [MSW](#msw)
- [미리보기](#미리보기)

## 요구사항

```
<기본 요건>
1. 데이터 저장을 위해서 Local/Session Storage등 자유로이 사용 가능합니다.
2. 프로젝트는 Next.js (14.x.x ~ 15.x.x)로 구현해야 합니다.
3. 스타일링은 Tailwind CSS (3.x.x)를 사용해야 합니다.
4. 프로젝트는 반드시 Typescript를 사용해야 합니다.
5. 라이브러리는 자유롭게 사용할 수 있습니다.

<To-Do 보드>
1. 보드를 생성할 수 있어야 합니다.
2. 보드를 수정할 수 있어야 합니다.
3. 보드를 삭제할 수 있어야 합니다.
4. 보드의 순서를 변경할 수 있어야 합니다.

<To-Do 할일>
1. 할 일은, 하나의 텍스트 박스를 가집니다.
2. 보드 안에서, 할 일을 생성할 수 있어야 합니다.
3. 보드 안에서, 할 일을 삭제할 수 있어야 합니다.
4. 보드 안에서, 할 일의 내용을 수정할 수 있어야 합니다.
5. 할 일의 위치를 변경할 수 있어야 한다. (보드간의 할 일 위치, 보드 내에서의 할 일 위치)
```

## 기술 스택

- `Next.js (15.1.7)`
- `react (18.2.0)`
- `zustand (5.0.3)`
- `tailwindcss (3.4.1)`
- `msw (2.7.0)`
- `react-toastify (11.0.3)`
- `@hello-pangea/dnd (18.0.1)`

## 커밋 컨벤션

- `feat/기능추가`
- `bugfix/버그수정`
- `refactor/기능개선`
- `style/스타일추가`

## 시작하기

### Step 1

```
# 로컬로 다운
git clone https://github.com/zzzRYT/LJJ_ToDoPage.git
```

### Step 2

```
# 설치
npm install

# 실행
npm run dev
```

## MSW

- 해당 과제에서는 백엔드를 대신해서 `MSW`라이브러리를 활용했습니다.
- `env` 파일 안에 `NEXT_PUBLIC_API_MOCKING=enabled` 값이 존재하지 않으면 제대로 동작하지 않습니다.

```
.env

NEXT_PUBLIC_API_MOCKING=enabled
```

## 미리보기

- [보드 추가](https://github.com/user-attachments/assets/71c22d0f-1554-4dac-b817-92403a2cda67)
- [보드 수정, 삭제](https://github.com/user-attachments/assets/c7c6845c-03ad-47f5-bcf0-18703d0b6373)
- [보드 위치 이동](https://github.com/user-attachments/assets/069ac5c4-3a27-478d-9c12-44c9541426d8)
- [할 일 추가](https://github.com/user-attachments/assets/0e27b280-3b37-4bb1-ad5d-835fb2b7d67a)
- [할 일 수정, 삭제](https://github.com/user-attachments/assets/9bfaaf22-7447-461e-becd-e65559438df8)
- [할 일 위치 이동](https://github.com/user-attachments/assets/d7c01285-36b8-4923-88f6-afb6ddbbcd73)
