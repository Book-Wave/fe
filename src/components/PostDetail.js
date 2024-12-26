import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";

function PostDetail() {
  const { postId } = useParams(); // URL에서 postId 가져오기
  const [postDetail, setPostDetail] = useState(null);

  const fetchPostDetail = async () => {
    try {
      const response = await api.getPostDetail(postId);
      setPostDetail(response.data);
    } catch (error) {
      console.error("게시물 상세 정보 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchPostDetail();
  }, [postId]);

  if (!postDetail) return <div>로딩 중...</div>;

  return (
    <div>
      <h2>게시물 상세 정보</h2>
      <p><strong>제목:</strong> {postDetail.title}</p>
      <p><strong>가격:</strong> {postDetail.price}</p>
      <p><strong>카테고리:</strong> {postDetail.categoryName}</p>
      <p><strong>설명:</strong> {postDetail.description}</p>
      <p><strong>메모:</strong> {postDetail.notes}</p>
      <button onClick={() => window.location.href = `/posts/${postId}/update`}>
        수정
      </button>
    </div>
  );
}

export default PostDetail;
