// 책 검색 API 호출 컴포넌트
import React, { useState } from "react";
import { api } from "../services/api"; // API 호출 함수 가져오기

function BookSearch({ onBookSelect }) {
  const [query, setQuery] = useState(""); // 검색어 상태
  const [results, setResults] = useState([]); // 검색 결과 상태

  // 검색 API 호출
  const handleSearch = async () => {
    try {
      const response = await api.searchBooks(query); // API 호출
      setResults(response.data); // 검색 결과 업데이트
    } catch (error) {
      console.error("책 검색 실패:", error); // 에러 처리
    }
  };

  return (
    <div>
      <h2>책 검색</h2>
      {/* 검색 입력 필드 */}
      <input
        type="text"
        value={query} // 검색어 입력
        onChange={(e) => setQuery(e.target.value)} // 상태 업데이트
        placeholder="검색어를 입력하세요"
      />
      <button onClick={handleSearch}>검색</button>

      {/* 검색 결과 리스트 */}
      <ul>
        {results.map((book, index) => (
          <li key={index} onClick={() => onBookSelect(book)}>
            <img src={book.image} alt={book.title} style={{ width: "50px" }} />
            <strong>{book.title}</strong> - {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookSearch;
