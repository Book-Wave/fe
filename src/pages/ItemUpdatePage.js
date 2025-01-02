import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getItemDetail, updateItem } from "../services/ItemService";

const ItemUpdatePage = () => {
  const { itemId } = useParams(); // URL에서 itemId 가져오기

  const [item, setItem] = useState({
    itemName: "",
    category: "",
    myPrice: "",
    note: "",
    author: "",
    description: "",
    publisher: "",
  }); // DB에서 가져온 데이터를 담을 상태

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

  useEffect(() => {
    // 초기 데이터 가져오기
    const fetchItem = async () => {
      try {
        const response = await getItemDetail(itemId); // GET 요청으로 데이터 가져오기
        console.log("Response received:", response); // 전체 응답 확인
        console.log("Response data:", response.data); // 응답 데이터 확인   
        setItem(response.data);     
      } catch (error) {
        console.error("Error fetching item data:", error);
        alert("상품 정보를 불러오지 못했습니다.");
      }
    };

    fetchItem();
  }, [itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateItem(itemId, item); // PUT 요청으로 수정된 데이터를 서버로 전송
      alert("상품이 수정되었습니다!");
      // navigate(`/items/${itemId}`); // 수정 완료 후 상세 페이지로 이동
    } catch (error) {
      console.error("Error updating item:", error);
      alert("상품 수정 중 오류가 발생했습니다.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!item) return <p>로딩 중...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>상품 수정</h1>
      <form onSubmit={handleSubmit}>
        {/* 게시물 이름 */}
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="itemName">게시물 이름:</label>
          <input
            type="text"
            id="itemName"
            name="itemName"
            value={item.itemName || ""}
            onChange={handleChange}
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
            name="category"
            value={item.category || ""}
            onChange={(e) =>
              handleChange({
                target: { name: "category", value: parseInt(e.target.value, 10) },
              })
            }
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

        {/* 가격 입력 */}
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="myPrice">가격:</label>
          <input
            type="number"
            id="myPrice"
            name="myPrice"
            value={item.myPrice || ""}
            onChange={handleChange}
            placeholder="가격을 입력하세요"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        {/* 저자 */}
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="author">저자:</label>
          <input
            type="text"
            id="author"
            name="author"
            value={item.author || ""}
            onChange={handleChange}
            placeholder="저자를 입력하세요"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        {/* 설명 */}
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="description">설명:</label>
          <textarea
            id="description"
            name="description"
            value={item.description || ""}
            onChange={handleChange}
            placeholder="상품 설명을 입력하세요"
            style={{ width: "100%", padding: "8px" }}
          ></textarea>
        </div>

        {/* 메모 */}
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="note">메모:</label>
          <textarea
            id="note"
            name="note"
            value={item.note || ""}
            onChange={handleChange}
            placeholder="상품에 대한 메모를 입력하세요"
            style={{ width: "100%", padding: "8px" }}
          ></textarea>
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#28a745",
            color: "#fff",
            border: "none",
          }}
        >
          수정하기
        </button>
      </form>
    </div>
  );
};

export default ItemUpdatePage;
