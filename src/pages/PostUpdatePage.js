// 게시물 수정 페이지
import React from "react";
import PostUpdate from "../components/PostUpdate";

function PostUpdatePage() {
  return (
    <div>
      <h1>게시물 수정</h1>
      <PostUpdate /> {/* 게시물 수정 컴포넌트 */}
    </div>
  );
}

export default PostUpdatePage;
