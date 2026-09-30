# Drug Management System - Docker 배포 가이드

## 📋 개요

이 문서는 마약관리시스템을 Docker를 사용하여 프로덕션 서버에 배포하는 방법을 설명합니다.

## 🔧 사전 요구사항

- Docker가 로컬 머신에 설치되어 있어야 합니다
- SSH 접근을 위한 PEM 키 파일 (`orbit_dev.pem`)
- 서버 접근 권한

## 📦 생성된 파일 목록

### 1. `Dockerfile`
- Multi-stage 빌드를 사용한 최적화된 Next.js 프로덕션 이미지
- Node.js 18 Alpine 기반
- 최소 이미지 크기를 위한 standalone 출력 모드 사용

### 2. `.dockerignore`
- Docker 빌드 시 제외할 파일 및 디렉토리 정의
- node_modules, 개발용 마크업 폴더 등 제외

### 3. `deploy.sh`
- 자동 배포 스크립트
- 빌드 → 이미지 저장 → 서버 전송 → 배포 전 과정 자동화

### 4. `next.config.js` (수정됨)
- `output: 'standalone'` 옵션 추가
- Docker 최적화를 위한 설정

## 🚀 배포 방법

### 1단계: 배포 스크립트 실행

```bash
cd apps/drug-management-system
./deploy.sh
```

### 2단계: 배포 프로세스

스크립트는 다음 작업을 자동으로 수행합니다:

1. ✅ 이전 Docker 이미지 정리
2. 🔨 새 Docker 이미지 빌드
3. 📦 이미지를 tar 파일로 저장
4. 📤 서버로 이미지 업로드
5. 🔄 서버에서 배포 실행:
   - 기존 컨테이너 중지/제거
   - 기존 이미지 제거
   - 새 이미지 로드
   - 새 컨테이너 실행
6. 🧹 로컬 임시 파일 정리
7. ✅ 배포 상태 확인

## 🔑 배포 설정

### 서버 정보
- **호스트**: 3.34.126.162
- **사용자**: ubuntu
- **포트**: 3002 (호스트) → 3000 (컨테이너)
- **컨테이너 이름**: drug-management-app
- **이미지 이름**: drug-management-system:latest

### 환경 변수 (필요시 수정)

`deploy.sh` 파일 상단의 설정 변수들을 수정할 수 있습니다:

```bash
IMAGE_NAME="drug-management-system"
IMAGE_TAG="latest"
CONTAINER_NAME="drug-management-app"
HOST_PORT="3002"
CONTAINER_PORT="3000"
```

## 🛠 유용한 명령어

### 로그 확인
```bash
ssh -i /Users/cheolminbae/Documents/orbit_dev.pem ubuntu@3.34.126.162 'docker logs -f drug-management-app'
```

### 컨테이너 재시작
```bash
ssh -i /Users/cheolminbae/Documents/orbit_dev.pem ubuntu@3.34.126.162 'docker restart drug-management-app'
```

### 컨테이너 중지
```bash
ssh -i /Users/cheolminbae/Documents/orbit_dev.pem ubuntu@3.34.126.162 'docker stop drug-management-app'
```

### 컨테이너 상태 확인
```bash
ssh -i /Users/cheolminbae/Documents/orbit_dev.pem ubuntu@3.34.126.162 'docker ps | grep drug-management'
```

### 서버 접속
```bash
ssh -i /Users/cheolminbae/Documents/orbit_dev.pem ubuntu@3.34.126.162
```

## 🌐 접속 URL

배포 후 다음 URL로 접속 가능합니다:
- **http://3.34.126.162:3002**

## ⚠️ 주의사항

1. **PEM 파일 위치**: PEM 파일이 `/Users/cheolminbae/Documents/orbit_dev.pem`에 있어야 합니다
2. **Docker 실행**: 로컬에서 Docker Desktop이 실행 중이어야 합니다
3. **네트워크**: 서버로의 SSH 및 SCP 접근이 가능해야 합니다
4. **포트 충돌**: 서버의 3002 포트가 사용 가능해야 합니다

## 🔍 트러블슈팅

### 빌드 실패 시
```bash
# Docker 로그 확인
docker build -t drug-management-system:latest .

# 캐시 없이 빌드
docker build --no-cache -t drug-management-system:latest .
```

### 배포 후 애플리케이션 응답 없음
```bash
# 서버에서 로그 확인
ssh -i /Users/cheolminbae/Documents/orbit_dev.pem ubuntu@3.34.126.162 'docker logs --tail 50 drug-management-app'

# 컨테이너 재시작
ssh -i /Users/cheolminbae/Documents/orbit_dev.pem ubuntu@3.34.126.162 'docker restart drug-management-app'
```

### 포트 충돌 시
`deploy.sh`의 `HOST_PORT` 값을 변경하고 재배포합니다.

## 📝 변경 이력

- 2025-10-02: 초기 Docker 배포 설정 생성

