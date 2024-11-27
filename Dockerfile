# # nginx 이미지를 사용합니다. 뒤에 tag가 없으면 latest를 사용합니다.
# FROM nginx:alpine

# # 빌드 폴더가 현재 경로에 있다고 가정하고 build 폴더를 복사
# # 이 단계는 로컬에서 React 애플리케이션을 build한 후에 실행해야 합니다.
# COPY ./build /usr/share/nginx/html

# # 기본 Nginx 설정 파일 덮어쓰기 (필요한 경우)
# COPY ./nginx.conf /etc/nginx/nginx.conf
# # 기본 default.conf 파일 삭제 (혹시 default.conf에서 추가 설정이 필요할 경우 설정할 수 있음)
# RUN rm /etc/nginx/conf.d/default.conf

# # 80 포트 열기
# EXPOSE 80

# # 컨테이너 실행 시 Nginx 시작
# CMD ["nginx", "-g", "daemon off;"]

FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build