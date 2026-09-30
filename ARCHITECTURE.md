# 재료연구관리시스템 - 기술 스택 및 아키텍처 문서

## 📋 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [프로젝트 구조](#프로젝트-구조)
4. [아키텍처 패턴](#아키텍처-패턴)
5. [주요 기능 및 구현](#주요-기능-및-구현)
6. [설정 파일](#설정-파일)
7. [개발 가이드](#개발-가이드)

---

## 프로젝트 개요

**재료연구관리시스템**은 마약류 관련 연구 및 자료를 체계적으로 관리하는 웹 애플리케이션입니다.

- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **상태 관리**: Jotai (전역 상태), React Query (서버 상태)
- **인증**: JWT 기반 인증 (Access Token + Refresh Token)

---

## 기술 스택

### Core Framework & Language
- **Next.js**: `^14.0.0` - React 프레임워크, App Router 사용
- **React**: `^18.0.0` - UI 라이브러리
- **TypeScript**: `^5.0.0` - 타입 안정성

### 상태 관리
- **Jotai**: `^2.6.0` - 전역 상태 관리 (Atom 기반)
- **@tanstack/react-query**: `^5.0.0` - 서버 상태 관리 및 데이터 페칭
- **@tanstack/react-query-devtools**: `^5.0.0` - React Query 개발 도구

### HTTP 클라이언트
- **axios**: `^1.6.0` - HTTP 요청 라이브러리
- **jwt-decode**: `^4.0.0` - JWT 토큰 디코딩

### UI & 스타일링
- **Tailwind CSS**: `^3.3.0` - 유틸리티 우선 CSS 프레임워크
- **@tailwindcss/typography**: `^0.5.19` - 타이포그래피 플러그인
- **@heroicons/react**: `^2.0.0` - 아이콘 라이브러리
- **lucide-react**: `^0.294.0` - 추가 아이콘 라이브러리
- **clsx**: `^2.0.0` - 조건부 클래스명 유틸리티

### Rich Text Editor
- **@tiptap/react**: `^3.6.2` - 리치 텍스트 에디터
- **@tiptap/starter-kit**: `^3.6.2` - 기본 확장 패키지
- **@tiptap/extension-***: 다양한 확장 기능 (이미지, 테이블, 링크 등)
- **lowlight**: `^3.3.0` - 코드 하이라이팅

### 개발 도구
- **ESLint**: `^8.0.0` - 코드 린팅
- **eslint-config-next**: `^14.0.0` - Next.js ESLint 설정
- **autoprefixer**: `^10.4.0` - CSS 자동 접두사
- **postcss**: `^8.4.0` - CSS 후처리

---

## 프로젝트 구조

```
apps/drug-management-system/
├── src/
│   ├── app/                      # Next.js App Router 페이지
│   │   ├── layout.tsx            # 루트 레이아웃
│   │   ├── page.tsx              # 메인 페이지
│   │   ├── globals.css           # 전역 스타일
│   │   ├── login/                # 로그인 페이지
│   │   ├── register/             # 회원가입 페이지
│   │   ├── intro/                # 센터소개 페이지
│   │   ├── research/             # 연구활동 (ADMIN 전용)
│   │   │   ├── page.tsx          # 연구활동 목록
│   │   │   ├── [id]/             # 연구활동 상세
│   │   │   ├── write/            # 연구활동 작성
│   │   │   └── seminar/          # 세미나 관련
│   │   ├── research-journal/     # 연구일지
│   │   ├── publications/         # 성과자료
│   │   ├── materials/            # 자료관리
│   │   ├── news/                 # 센터소식
│   │   └── terms/                # 이용약관
│   │
│   ├── components/               # 재사용 가능한 컴포넌트
│   │   ├── auth/                 # 인증 관련 컴포넌트
│   │   │   └── AuthGuard.tsx     # 인증 가드 (라우트 보호)
│   │   ├── board/                # 게시판 공통 컴포넌트
│   │   │   ├── BoardTable.tsx    # 게시판 테이블
│   │   │   ├── SearchFilter.tsx  # 검색 필터
│   │   │   └── Pagination.tsx    # 페이지네이션
│   │   ├── header/               # 헤더 컴포넌트
│   │   ├── navigation/           # 네비게이션 컴포넌트
│   │   ├── footer/               # 푸터 컴포넌트
│   │   ├── main-content/         # 메인 페이지 컨텐츠
│   │   ├── article-detail/       # 게시글 상세 뷰
│   │   ├── rich-text-editor/     # 리치 텍스트 에디터
│   │   └── providers/            # Context Provider
│   │       └── QueryProvider.tsx # React Query Provider
│   │
│   ├── hooks/                    # 커스텀 훅
│   │   ├── queries/              # React Query 훅
│   │   │   ├── articles.ts      # 게시글 관련 쿼리
│   │   │   ├── auth.ts           # 인증 관련 쿼리
│   │   │   ├── boards.ts         # 게시판 관련 쿼리
│   │   │   ├── comments.ts       # 댓글 관련 쿼리
│   │   │   ├── files.ts          # 파일 관련 쿼리
│   │   │   ├── messages.ts       # 메시지 관련 쿼리
│   │   │   ├── users.ts          # 사용자 관련 쿼리
│   │   │   └── queryKeys.ts      # 쿼리 키 상수
│   │   └── useAuth.ts            # 인증 관련 훅
│   │
│   ├── services/                 # API 서비스 레이어
│   │   ├── api.ts                # Axios 인스턴스 및 인터셉터
│   │   ├── articles.ts           # 게시글 API
│   │   ├── auth.ts               # 인증 API
│   │   ├── boards.ts              # 게시판 API
│   │   ├── comments.ts           # 댓글 API
│   │   ├── files.ts              # 파일 API
│   │   ├── messages.ts           # 메시지 API
│   │   ├── users.ts              # 사용자 API
│   │   └── index.ts              # 서비스 export
│   │
│   ├── store/                    # 전역 상태 관리
│   │   ├── commonAtoms.ts        # Jotai atoms (네비게이션, 메뉴 등)
│   │   └── index.ts
│   │
│   ├── types/                    # TypeScript 타입 정의
│   │   └── index.ts              # 모든 타입 정의
│   │
│   ├── utils/                    # 유틸리티 함수
│   │   └── auth.ts               # 인증 유틸리티 (roles 체크 등)
│   │
│   └── lib/                      # 라이브러리 설정
│       └── queryClient.ts        # React Query 클라이언트 설정
│
├── public/                       # 정적 파일
│   └── images/                  # 이미지 파일
│
├── next.config.js               # Next.js 설정
├── tailwind.config.js           # Tailwind CSS 설정
├── tsconfig.json                # TypeScript 설정
├── postcss.config.js            # PostCSS 설정
└── package.json                 # 의존성 관리
```

---

## 아키텍처 패턴

### 1. 계층형 아키텍처 (Layered Architecture)

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  (Pages, Components, Hooks)         │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│         Service Layer               │
│  (API Services, Business Logic)     │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│         Data Layer                  │
│  (Axios, API Calls)                │
└─────────────────────────────────────┘
```

### 2. 상태 관리 전략

#### 전역 상태 (Jotai)
- **용도**: UI 상태, 설정값, 네비게이션 메뉴 등
- **위치**: `src/store/commonAtoms.ts`
- **예시**: `navItemsAtom`, `menuItemsAtom`, `siteConfigAtom`

#### 서버 상태 (React Query)
- **용도**: API 데이터 캐싱, 동기화, 에러 처리
- **위치**: `src/hooks/queries/`
- **특징**: 
  - 자동 캐싱 (5분)
  - 자동 재시도
  - Optimistic Updates 지원

### 3. 인증 및 권한 관리

#### JWT 기반 인증
- **Access Token**: API 요청 시 사용, 짧은 만료 시간
- **Refresh Token**: Access Token 갱신용, 긴 만료 시간
- **저장 위치**: `localStorage`

#### 토큰 갱신 전략
```typescript
// 자동 토큰 갱신 (5분 이내 만료 시)
if (isTokenExpiringSoon()) {
  await refreshAccessToken();
}
```

#### 권한 기반 접근 제어 (RBAC)
- **역할 기반**: `roles: ['ADMIN']` 형태로 관리
- **유틸리티**: `src/utils/auth.ts`
  - `getRolesFromToken()`: 토큰에서 roles 추출
  - `hasRole(role)`: 특정 역할 확인
  - `isAdmin()`: ADMIN 권한 확인

### 4. API 통신 패턴

#### Axios 인터셉터
- **Request Interceptor**: 
  - 토큰 자동 첨부
  - 토큰 만료 시 자동 갱신
  - 갱신 중 요청 큐잉 처리
  
- **Response Interceptor**:
  - 401 에러 시 자동 로그아웃
  - 에러 응답 처리

#### API 서비스 레이어
- 각 도메인별로 서비스 파일 분리
- 타입 안정성 보장
- 재사용 가능한 함수 제공

---

## 주요 기능 및 구현

### 1. 게시판 시스템

#### 게시판 구조
- **연구활동** (boardId: 2) - ADMIN 전용
- **연구일지** (boardId: 2) - 사용자별 필터링
- **성과자료** (boardId: 4)
- **센터소식** (boardId: 1)
- **자료관리** (boardId: 1) - `[자료관리]` prefix로 구분

#### 공통 기능
- 목록 조회 (페이지네이션)
- 검색 (제목, 연구자, 연구기관, 프로젝트, 장비)
- 상세 조회
- 작성/수정/삭제
- 파일 첨부
- 댓글 시스템

### 2. 권한 관리

#### ADMIN 전용 기능
- 연구활동 메뉴 접근
- 연구일지 승인/반려
- 모든 사용자의 연구일지 조회

#### 사용자별 필터링
- 연구일지: 본인이 작성한 게시글만 조회
- 연구활동: 모든 게시글 조회 (ADMIN만 접근)

### 3. 리치 텍스트 에디터

#### TipTap 기반 에디터
- **기능**: 
  - 텍스트 포맷팅 (볼드, 이탤릭, 밑줄 등)
  - 이미지 삽입
  - 테이블 생성
  - 링크 삽입
  - 코드 블록 (하이라이팅)
  - 색상 지정

### 4. 파일 관리

#### 메타데이터 저장
- 프로젝트명, 장비명을 HTML content에 숨겨서 저장
- `<div data-project="...">`, `<div data-equipment="...">` 형태
- 검색 시 메타데이터도 함께 검색

---

## 설정 파일

### next.config.js
```javascript
{
  experimental: {
    appDir: true,  // App Router 사용
  },
  output: 'standalone',  // Docker 배포용
  rewrites: [
    {
      source: '/api/orbit/:path*',
      destination: 'http://3.34.126.162:9001/orbit/:path*',
    },
  ],
}
```

### tailwind.config.js
- 커스텀 컬러: `primary`, `blue`, `danger`, `success`
- 폰트: Pretendard
- 플러그인: `@tailwindcss/typography`

### tsconfig.json
- **baseUrl**: `"."`
- **paths**: `@/*` → `./src/*`
- **strict**: `true`

---

## 개발 가이드

### 1. 프로젝트 설정

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev  # http://localhost:3002

# 빌드
pnpm build

# 프로덕션 실행
pnpm start
```

### 2. 코드 스타일

#### 컴포넌트 구조
```typescript
// 1. Imports
import React from 'react';
import { useAtom } from 'jotai';

// 2. Types/Interfaces
interface Props {
  // ...
}

// 3. Component
export const Component: React.FC<Props> = ({ ... }) => {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Handlers
  const handleClick = () => { ... };
  
  // 6. Render
  return <div>...</div>;
};
```

#### 파일 네이밍
- **컴포넌트**: PascalCase (예: `BoardTable.tsx`)
- **훅**: camelCase with `use` prefix (예: `useAuth.ts`)
- **유틸리티**: camelCase (예: `auth.ts`)
- **타입**: camelCase (예: `index.ts`)

### 3. 상태 관리 패턴

#### Jotai 사용
```typescript
// store/commonAtoms.ts
export const navItemsAtom = atom<NavItem[]>([...]);

// Component
const [navItems] = useAtom(navItemsAtom);
```

#### React Query 사용
```typescript
// hooks/queries/articles.ts
export const useArticles = (boardId: number, page: number) => {
  return useQuery({
    queryKey: ['articles', boardId, page],
    queryFn: () => articlesService.getArticles(boardId, page),
  });
};
```

### 4. API 서비스 패턴

```typescript
// services/articles.ts
export const articlesService = {
  getArticles: async (boardId: number, page: number) => {
    const response = await api.get(`/boards/${boardId}/articles`, {
      params: { page, size: 10 },
    });
    return response.data;
  },
  
  createArticle: async (boardId: number, data: CreateArticleDto) => {
    const response = await api.post(`/boards/${boardId}/articles`, data);
    return response.data;
  },
};
```

### 5. 인증 처리

```typescript
// 권한 확인
import { isAdmin, hasRole } from '@/utils/auth';

if (isAdmin()) {
  // ADMIN 전용 로직
}

// 토큰에서 roles 추출
import { getRolesFromToken } from '@/utils/auth';
const roles = getRolesFromToken(); // ['ADMIN']
```

### 6. 에러 처리

#### React Query 에러 처리
```typescript
const { data, error, isLoading } = useQuery({
  queryKey: ['articles'],
  queryFn: fetchArticles,
  retry: (failureCount, error) => {
    // 401, 403, 404는 재시도하지 않음
    if ([401, 403, 404].includes(error?.response?.status)) {
      return false;
    }
    return failureCount < 3;
  },
});
```

#### API 에러 처리
```typescript
try {
  await mutation.mutateAsync(data);
} catch (error: any) {
  if (error?.response?.status === 403) {
    alert('권한이 없습니다.');
  }
}
```

---

## 배포

### Docker 배포
- `Dockerfile` 사용
- `output: 'standalone'` 모드
- 포트: 3002

### 환경 변수
- API Base URL: `/api/orbit` (프록시 설정)

---

## 참고 사항

### 주요 의존성 버전
- Next.js: 14.x
- React: 18.x
- TypeScript: 5.x
- Tailwind CSS: 3.x
- React Query: 5.x
- Jotai: 2.x

### 브라우저 지원
- 최신 브라우저 (Chrome, Firefox, Safari, Edge)
- ES6+ 지원 필요

### 성능 최적화
- React Query 캐싱 (5분)
- 이미지 최적화 (Next.js Image)
- 코드 스플리팅 (자동)

---

## 향후 개선 사항

1. **테스트**: Jest + React Testing Library 추가
2. **상태 관리**: Zustand 고려 (Jotai 대체 검토)
3. **폼 관리**: React Hook Form + Zod 추가
4. **국제화**: i18next 추가
5. **모니터링**: Sentry 등 에러 추적 도구 추가

---

**작성일**: 2025-01-17  
**버전**: 1.0.0

