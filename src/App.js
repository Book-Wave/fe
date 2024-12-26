import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 주요 컴포넌트 임포트
import ItemList from "./components/ItemList"; // 상품 목록
import ItemDetail from "./components/ItemDetail"; // 상품 상세
import ItemUpdate from "./components/ItemUpdate"; // 상품 수정
import PostList from "./components/PostList"; // 게시물 목록
import PostDetail from "./components/PostDetail"; // 게시물 상세
import PostRegister from "./components/PostRegister"; // 게시물 등록
import PostUpdate from "./components/PostUpdate"; // 게시물 수정
import BookSearch from "./components/BookSearch"; // 책 검색
import ItemRegister from "./components/ItemRegister"; // 상품 등록 컴포넌트 추가

function App() {
  return (
    <Router>
      {/* 모든 페이지를 라우트로 정의 */}
      <Routes>
        {/* 상품 관련 페이지 */}
        <Route path="/" element={<ItemList />} /> {/* 상품 목록 */}
        <Route path="/items/register" element={<ItemRegister />} /> {/* 상품 등록 */}
        <Route path="/items/:itemId" element={<ItemDetail />} /> {/* 상품 상세 */}
        <Route path="/items/:itemId/update" element={<ItemUpdate />} /> {/* 상품 수정 */}

        {/* 게시물 관련 페이지 */}
        <Route path="/posts" element={<PostList />} /> {/* 게시물 목록 */}
        <Route path="/posts/:postId" element={<PostDetail />} /> {/* 게시물 상세 */}
        <Route path="/posts/register" element={<PostRegister />} /> {/* 게시물 등록 */}
        <Route path="/posts/:postId/update" element={<PostUpdate />} /> {/* 게시물 수정 */}

        {/* 책 검색 페이지 */}
        <Route path="/book-search" element={<BookSearch />} /> {/* 책 검색 */}
      </Routes>
    </Router>
  );
}

export default App; // App 컴포넌트 내보내기
