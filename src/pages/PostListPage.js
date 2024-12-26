// 게시물 목록 페이지
import React from "react";
import PostList from "../components/PostList";

function PostListPage() {
  return (
    <div>
      <h1>게시물 목록</h1>
      <PostList /> {/* 게시물 목록 컴포넌트 */}
    </div>
  );
}

export default PostListPage;
