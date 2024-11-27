FROM node:18

WORKDIR /app
COPY . .

RUN npm install

# 리액트 앱을 3000번 포트에서 실행
CMD ["npm", "start"]

EXPOSE 3000