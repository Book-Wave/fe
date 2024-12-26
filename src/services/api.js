import axios from 'axios';

const BASE_URL = 'http://localhost:8080/book/item'; // 공통 API URL

export const api = {
  // 상품 관련 엔드포인트
  getItems: (params) => axios.get(`${BASE_URL}/list`, { params }), // 상품 목록 조회
  getPaginatedItems: (page, size) =>
    axios.get(`${BASE_URL}/list/page?page=${page}&size=${size}`), // 페이지네이션된 상품 목록
  getItemDetail: (itemId) => axios.get(`${BASE_URL}/${itemId}`), // 특정 상품 상세 조회
  registerItem: (data) => axios.post(`${BASE_URL}/register`, data), // 상품 등록
  updateItem: (itemId, data) => axios.put(`${BASE_URL}/${itemId}/update`, data), // 상품 수정
  deleteItem: (itemId) => axios.delete(`${BASE_URL}/${itemId}/delete`), // 상품 삭제

  // 카테고리 관련 엔드포인트
  getCategories: () => axios.get(`${BASE_URL}/categories`), // 카테고리 목록 조회

  // 게시물 관련 엔드포인트
  getPosts: (params) => axios.get(`${BASE_URL}/post/list`, { params }), // 게시물 목록 조회
  getPostDetail: (postId) => axios.get(`${BASE_URL}/post/${postId}`), // 특정 게시물 상세 조회
  registerPost: (data) => axios.post(`${BASE_URL}/post/register`, data), // 게시물 등록
  updatePost: (postId, data) =>
    axios.put(`${BASE_URL}/post/${postId}/update`, data), // 게시물 수정
  deletePost: (postId) => axios.delete(`${BASE_URL}/post/${postId}/delete`), // 게시물 삭제

  // 책 검색 관련 엔드포인트
  searchBooks: (query) =>
    axios.get(`${BASE_URL}/search`, { params: { query } }), // 책 검색 API 호출
};
