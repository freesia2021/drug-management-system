# 마약관리시스템 (Drug Management System)

의료진을 위한 마약류 관리 솔루션입니다.

## 주요 기능

- **마약류 재고 관리**: 마약류의 입고, 출고, 재고 현황을 실시간으로 관리
- **환자 관리**: 마약류 처방 환자의 상태와 처방 이력을 추적
- **통계 및 보고서**: 마약류 사용량, 처방 패턴 등의 상세한 분석 제공
- **보안 및 감사**: 모든 마약류 관련 활동을 안전하게 기록하고 감사

## 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Build Tool**: Turbo (Monorepo)

## 개발 환경 설정

### 1. 의존성 설치
```bash
# 루트 디렉토리에서
pnpm install
```

### 2. 개발 서버 실행
```bash
# 마약관리시스템만 실행
pnpm drug:dev

# 또는 모든 앱 실행
pnpm dev
```

### 3. 빌드
```bash
# 마약관리시스템 빌드
pnpm drug:build

# 또는 모든 앱 빌드
pnpm build
```

## 프로젝트 구조

```
apps/drug-management-system/
├── src/
│   └── app/
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── public/
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 사용 가능한 스크립트

- `pnpm drug:dev` - 개발 서버 실행
- `pnpm drug:build` - 프로덕션 빌드
- `pnpm drug:start` - 프로덕션 서버 실행
- `pnpm drug:clean` - 빌드 파일 정리

## 라이선스

이 프로젝트는 의료용 마약류 관리 목적으로만 사용되어야 합니다.
