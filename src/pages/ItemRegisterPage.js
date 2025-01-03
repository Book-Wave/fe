import React, { useState } from "react";

import { registerItem } from "../services/ItemService";
import { fetchNickName } from "../services/ChatService";
import BookSearch from "../components/BookSearch";


const ItemRegisterPage = () => {
  // 카테고리 데이터
  const categories = [
    { category_id: 1, category_name: "총류" },
    { category_id: 2, category_name: "철학" },
    { category_id: 3, category_name: "종교" },
    { category_id: 4, category_name: "사회과학" },
    { category_id: 5, category_name: "자연과학" },
    { category_id: 6, category_name: "기술과학" },
    { category_id: 7, category_name: "예술" },
    { category_id: 8, category_name: "언어" },
    { category_id: 9, category_name: "문학" },
    { category_id: 10, category_name: "역사" },
    { category_id: 11, category_name: "기타" },
  ];

  // 상태 관리
  const [itemName, setItemName] = useState(""); // 게시물 이름
  const [myPrice, setMyPrice] = useState(""); // 상품 가격
  const [note, setNote] = useState(""); // 메모
  const [selectedCategory, setSelectedCategory] = useState({}); // 선택한 카테고리
  const [bookInfo, setBookInfo] = useState(null); // 선택된 책 정보


  // 로컬 스토리지에서 sellerId 가져오기
  const sellerId = fetchNickName().data;

  // POST 요청 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...bookInfo,  
      itemName,
      category: selectedCategory.category_id,
      categoryName: selectedCategory.category_name,
      sellerId,
      myPrice: parseInt(myPrice, 10),
      note,
     
    };

    try {
      const response = await registerItem(payload); // 외부 메서드 호출
      alert("상품이 등록되었습니다!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error registering item:", error);
      alert("상품 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>상품 등록</h1>
      <form onSubmit={handleSubmit}>
        {/* 게시물 이름 */}
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="itemName">게시물 이름:</label>
          <input
            type="text"
            id="itemName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="게시물 이름을 입력하세요"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        {/* 카테고리 선택 */}
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="category">카테고리:</label>
          <select
            id="category"
            value={selectedCategory.category_id || ""}
            onChange={(e) => {
              const selected = categories.find((cat) => cat.category_id === parseInt(e.target.value, 10));
              setSelectedCategory(selected || {});
            }}
            required
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="" disabled>
              카테고리를 선택하세요
            </option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        {/* 책 검색 */}
        <BookSearch setBookInfo={setBookInfo} />

        {/* 가격 입력 */}
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="myPrice">가격:</label>
          <input
            type="number"
            id="myPrice"
            value={myPrice}
            onChange={(e) => setMyPrice(e.target.value)}
            placeholder="가격을 입력하세요"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        {/* 메모 입력 */}
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="note">메모:</label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="상품에 대한 메모를 입력하세요"
            style={{ width: "100%", padding: "8px" }}
          ></textarea>
        </div>

        {/* 제출 버튼 */}
        <button type="submit" style={{ padding: "10px 20px", background: "#007BFF", color: "#fff", border: "none" }}>
          등록하기
        </button>
      </form>
    </div>
  );
};

export default ItemRegisterPage;
