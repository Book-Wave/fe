import React, { useState } from "react";
import { searchBooksFromApi } from "../services/ItemService";

const BookSearch = ({ setBookInfo }) => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [manualEntry, setManualEntry] = useState(false);

  const searchBooks = async () => {
    try {
      const response = await searchBooksFromApi(query); // API 호출
      const books = response.data || []; // 배열로 직접 처리
      if (books.length === 0) {
        alert("검색 결과가 없습니다.");
      }
      setBooks(books);
      console.log("검색 결과:", books);
    } catch (error) {
      console.error("Error searching books:", error);
      alert("책 검색 중 오류가 발생했습니다.");
    }
  };

  const handleManualEntry = () => {
    setManualEntry(true);
    setBookInfo(null);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h2>책 검색</h2>
      <div style={{ display: "flex", marginBottom: "10px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="책 이름을 입력하세요"
          style={{ flex: 1, padding: "8px" }}
        />
        <button
          type="button"
          onClick={searchBooks}
          style={{ padding: "8px 16px" }}
        >
          검색
        </button>
      </div>

      {books.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {books.map((book, index) => (
            <li
              key={index}
              style={{
                marginBottom: "10px",
                border: "1px solid #ddd",
                padding: "10px",
              }}
            >
              <h4>{book.title}</h4>
              <p>저자: {book.author}</p>
              <p>출판사: {book.publisher}</p>
              <button
                type="button"
                onClick={() => {
                  setBookInfo({
                    title: book.title,
                    author: book.author,
                    publisher: book.publisher,
                    image: book.image,
                    link: book.link,
                    description: book.description,
                    myPrice: "", // 가격은 사용자 입력으로 설정
                    note: "", // 메모는 기본값으로 설정
                  });
                }}
                style={{
                  padding: "8px 16px",
                  background: "#28a745",
                  color: "#fff",
                  border: "none",
                }}
              >
                선택
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={handleManualEntry}
        style={{ padding: "8px 16px", marginTop: "10px" }}
      >
        직접 입력하기
      </button>

      {manualEntry && (
        <div>
          <h3>책 정보 직접 입력</h3>
          <input
            type="text"
            placeholder="책 이름"
            onChange={(e) =>
              setBookInfo((prev) => ({ ...prev, title: e.target.value }))
            }
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <input
            type="text"
            placeholder="저자"
            onChange={(e) =>
              setBookInfo((prev) => ({ ...prev, author: e.target.value }))
            }
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          {/* Add more fields as needed */}
        </div>
      )}
    </div>
  );
};

export default BookSearch;
