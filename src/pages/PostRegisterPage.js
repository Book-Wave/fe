// 게시물 등록 페이지
import React from "react";
import PostRegister from "../components/PostRegister";

function PostRegisterPage() {
  return (
    <div>
      <h1>게시물 등록</h1>
      <PostRegister /> {/* 게시물 등록 컴포넌트 */}
    </div>
  );
}

export default PostRegisterPage;
