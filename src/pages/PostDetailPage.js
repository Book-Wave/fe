// 게시물 상세보기 페이지
import React from "react";
import PostDetail from "../components/PostDetail";

function PostDetailPage() {
  return (
    <div>
      <h1>게시물 상세정보</h1>
      <PostDetail /> {/* 게시물 상세보기 컴포넌트 */}
    </div>
  );
}

export default PostDetailPage;
