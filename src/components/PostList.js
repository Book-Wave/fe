import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import Pagination from "./Pagination"; // 페이지네이션 컴포넌트

function PostList() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async (page) => {
    try {
      const response = await api.getPosts({ page, size: 10 });
      setPosts(response.data.items);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("게시물 목록 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchPosts(1); // 첫 페이지 불러오기
  }, []);

  const handlePageChange = (page) => {
    fetchPosts(page);
  };

  return (
    <div>
      <h2>게시물 목록</h2>
      <table>
        <thead>
          <tr>
            <th>제목</th>
            <th>가격</th>
            <th>카테고리</th>
            <th>상세보기</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.postId}>
              <td>{post.title}</td>
              <td>{post.price}</td>
              <td>{post.categoryName}</td>
              <td>
                <button onClick={() => (window.location.href = `/posts/${post.postId}`)}>
                  상세보기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}

export default PostList;
