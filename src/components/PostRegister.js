import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import BookSearch from "./BookSearch"; // 책 검색 컴포넌트

function PostRegister() {
  const [categories, setCategories] = useState([]);
  const [postData, setPostData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    notes: "",
  });
  const [selectedBook, setSelectedBook] = useState(null); // 선택된 책

  const fetchCategories = async () => {
    try {
      const response = await api.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("카테고리 목록 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    try {
      const payload = {
        ...postData,
        title: selectedBook ? selectedBook.title : postData.title,
        description: selectedBook ? selectedBook.description : postData.description,
      };
      await api.registerPost(payload);
      alert("게시물 등록 성공!");
    } catch (error) {
      console.error("게시물 등록 실패:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h2>게시물 등록</h2>
      <BookSearch onBookSelect={(book) => setSelectedBook(book)} /> {/* 책 검색 */}
      {selectedBook && (
        <div>
          <h3>선택된 책 정보</h3>
          <p><strong>제목:</strong> {selectedBook.title}</p>
          <p><strong>출판사:</strong> {selectedBook.publisher}</p>
        </div>
      )}
      <form>
        <label>
          가격:
          <input
            type="number"
            name="price"
            value={postData.price}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          카테고리:
          <select
            name="category"
            value={postData.category}
            onChange={handleInputChange}
          >
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          메모:
          <textarea
            name="notes"
            value={postData.notes}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button type="button" onClick={handleSubmit}>
          등록
        </button>
      </form>
    </div>
  );
}

export default PostRegister;
