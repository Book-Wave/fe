// React 앱의 진입점 설정
import React from "react";
import ReactDOM from "react-dom";
import App from "./App"; // 전체 라우팅 설정 파일 가져오기

// React 앱을 DOM에 렌더링
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root") // 루트 엘리먼트에 렌더링
);
