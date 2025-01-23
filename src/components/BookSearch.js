import React, { useState } from "react";
import { searchBooksFromApi } from "../services/ItemService";

const BookSearch = ({ setBookInfo }) => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [manualBookInfo, setManualBookInfo] = useState({
    title: "",
    author: "",
    publisher: "",
  });

  // API 호출
  const searchBooks = async () => {
    try {
      const response = await searchBooksFromApi(query);
      const books = response.data || [];
      if (books.length === 0) {
        alert("검색 결과가 없습니다.");
      }
      console.log("API 응답 데이터:", books);
    
      setBooks(books);
    } catch (error) {
      console.error("책 검색 중 오류:", error);
      alert("책 검색 중 오류가 발생했습니다.");
    }
  };

  // 직접 입력 데이터 저장
  const handleSaveManualEntry = () => {
    if (!manualBookInfo.title || !manualBookInfo.author) {
      alert("책 제목과 저자를 모두 입력해야 합니다.");
      return;
    }
    setBookInfo(manualBookInfo);
    alert("책 정보가 저장되었습니다!");
  };

  return (
    <div
      style={{
        maxWidth: "450px",
        width: "120%",
        margin: "0 auto",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ fontSize: "18px", marginBottom: "15px", textAlign: "center" }}>
        책 검색
      </h2>
      <div style={{ display: "flex", marginBottom: "15px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="책 이름을 입력하세요"
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        />
        <button
          type="button"
          onClick={searchBooks}
          style={{
            padding: "10px 15px",
            marginLeft: "10px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          검색
        </button>
      </div>

      {books.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {books.map((book, index) => (
            <li
              key={index}
              style={{
                marginBottom: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "10px",
                fontSize: "14px",
              }}
            >
              <h4 style={{ margin: 0, fontSize: "16px" }}>{book.title}</h4>
              <p style={{ margin: "5px 0" }}>저자: {book.author}</p>
              <p style={{ margin: "5px 0" }}>출판사: {book.publisher}</p>
              <p style={{ margin: "5px 0" }}>가격: {book.price || "정보 없음"}</p>
              <p style={{ margin: "5px 0" }}>
                설명: {book.description || "정보 없음"}
              </p>
              <p style={{ margin: "5px 0" }}>
                <a
                  href={book.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#007BFF" }}
                >
                  더 보기
                </a>
              </p>
              {book.image && (
                <img
                  src={book.image}
                  alt="책 이미지"
                  style={{ width: "80px", height: "auto", display: "block" }}
                />
              )}
              <button
                type="button"
                onClick={() =>
                  setBookInfo({
                    title: book.title,
                    author: book.author,
                    publisher: book.publisher,
                    price: book.price,
                    description: book.description,
                    link: book.link,
                    image: book.image,
                  })
                }
                style={{
                  padding: "8px 16px",
                  background: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                선택
              </button>
            </li>
          ))}
        </ul>
      )}

      <div>
        <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>책 정보 직접 입력</h3>
        <input
          type="text"
          placeholder="책 이름"
          value={manualBookInfo.title}
          onChange={(e) =>
            setManualBookInfo((prev) => ({ ...prev, title: e.target.value }))
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        />
        <input
          type="text"
          placeholder="저자"
          value={manualBookInfo.author}
          onChange={(e) =>
            setManualBookInfo((prev) => ({ ...prev, author: e.target.value }))
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        />
        <input
          type="text"
          placeholder="출판사"
          value={manualBookInfo.publisher}
          onChange={(e) =>
            setManualBookInfo((prev) => ({
              ...prev,
              publisher: e.target.value,
            }))
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        />
        <button
          type="button"
          onClick={handleSaveManualEntry}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          정보 저장
        </button>
      </div>
    </div>
  );
};

export default BookSearch;
