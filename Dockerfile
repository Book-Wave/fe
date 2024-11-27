FROM node:18 AS builder
WORKDIR /app

# 소스 코드 복사
COPY . .

# 의존성 설치 및 빌드
RUN npm install && npm run build

# 빌드된 파일을 Nginx로 서빙하기 위해 Nginx 이미지 사용
FROM nginx:alpine

# 리액트 빌드된 파일을 Nginx의 기본 웹 디렉토리에 복사
COPY --from=builder /app/build /usr/share/nginx/html

# 80번 포트에서 리액트 앱을 서빙
EXPOSE 3000

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
