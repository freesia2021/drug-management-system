#!/bin/bash
set -e

# 색상 설정
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 설정 변수들
IMAGE_NAME="drug-management-system"
IMAGE_TAG="latest"
TAR_FILE="${IMAGE_NAME}-${IMAGE_TAG}.tar"
SERVER_HOST="114.205.56.204"
SERVER_USER="autocar"
SERVER_PASS="Psi10!"
SERVER_PATH="/home/autocar/docker-images"
CONTAINER_NAME="drug-management-app"
HOST_PORT="80"
CONTAINER_PORT="3000"

echo -e "${BLUE}🚀 Starting deployment process for Drug Management System...${NC}"

# 1. 기존 이미지 정리 (선택사항)
echo -e "${YELLOW}🧹 Cleaning up old images...${NC}"
docker image prune -f

# 2. Docker 이미지 빌드 (AMD64 플랫폼)
echo -e "${YELLOW}🔨 Building Docker image for linux/amd64...${NC}"
docker buildx build --platform linux/amd64 -t ${IMAGE_NAME}:${IMAGE_TAG} --load .

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Docker build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker image built successfully!${NC}"

# 3. 이미지를 tar 파일로 저장
echo -e "${YELLOW}📦 Saving image to tar file...${NC}"
docker save -o ${TAR_FILE} ${IMAGE_NAME}:${IMAGE_TAG}

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to save Docker image!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Image saved as ${TAR_FILE}${NC}"
echo -e "${BLUE}📊 Image size: $(du -h ${TAR_FILE} | cut -f1)${NC}"

# 4. 서버에 디렉토리 생성
echo -e "${YELLOW}📁 Creating directory on server...${NC}"
expect << EOF
set timeout 30
spawn ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${SERVER_PATH}"
expect "*assword*"
send "${SERVER_PASS}\r"
expect eof
EOF

# 5. tar 파일을 서버로 전송
echo -e "${YELLOW}📤 Uploading image to server (this may take a while)...${NC}"
expect << EOF
set timeout 600
spawn scp -o StrictHostKeyChecking=no ${TAR_FILE} ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/
expect "*assword*"
send "${SERVER_PASS}\r"
expect eof
EOF

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to upload image!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Image uploaded successfully!${NC}"

# 6. 서버에서 배포 스크립트 실행
echo -e "${YELLOW}🔄 Deploying on server...${NC}"

DEPLOY_SCRIPT="cd ${SERVER_PATH} && \
docker stop ${CONTAINER_NAME} 2>/dev/null || true && \
docker rm ${CONTAINER_NAME} 2>/dev/null || true && \
docker rmi ${IMAGE_NAME}:${IMAGE_TAG} 2>/dev/null || true && \
docker load -i ${TAR_FILE} && \
docker run -d --name ${CONTAINER_NAME} -p ${HOST_PORT}:${CONTAINER_PORT} --restart unless-stopped ${IMAGE_NAME}:${IMAGE_TAG} && \
rm -f ${TAR_FILE} && \
docker ps | grep ${CONTAINER_NAME}"

expect << EOF
set timeout 300
spawn ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_HOST} "${DEPLOY_SCRIPT}"
expect "*assword*"
send "${SERVER_PASS}\r"
expect eof
EOF

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed!${NC}"
    exit 1
fi

# 7. 로컬 tar 파일 정리
echo -e "${YELLOW}🧹 Cleaning up local files...${NC}"
rm -f ${TAR_FILE}

# 8. 배포 결과 확인
echo -e "${YELLOW}🔍 Checking deployment status...${NC}"
sleep 8

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://${SERVER_HOST}:${HOST_PORT})
if [ "${HTTP_STATUS}" = "200" ] || [ "${HTTP_STATUS}" = "301" ] || [ "${HTTP_STATUS}" = "302" ]; then
    echo -e "${GREEN}✅ Application is running successfully!${NC}"
    echo -e "${GREEN}🌐 Access URL: http://${SERVER_HOST}:${HOST_PORT}${NC}"
else
    echo -e "${YELLOW}⚠️  Application returned HTTP ${HTTP_STATUS}${NC}"
    echo -e "${YELLOW}🔍 Check logs manually on server${NC}"
fi

echo -e "${GREEN}🎉 Deployment process completed!${NC}"
echo -e "${BLUE}ℹ️  서버 접속: ssh ${SERVER_USER}@${SERVER_HOST}${NC}"
echo -e "${BLUE}ℹ️  로그 확인: docker logs -f ${CONTAINER_NAME}${NC}"
