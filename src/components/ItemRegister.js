import React, { useState, useEffect } from "react";
import { api } from "../services/api";

function ItemRegister() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
  });

  // 카테고리 목록 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await api.getCategories();
      setCategories(response);
    };
    fetchCategories();
  }, []);

  // 입력값 변경 처리
  const handleChange = (e) => {
    console.log("메서드 진입")
    const { name, value } = e.target;
    console.log("e.타켓 확인 + " + e.target)
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 상품 등록
  const handleRegister = async () => {
    try {
      await api.registerItem(formData);
      alert("상품 등록이 완료되었습니다!");
    } catch (error) {
      console.error("상품 등록 실패:", error);
    }
  };

  return (
    <div>
      <h2>상품 등록</h2>
      <form>
        <label>
          상품명:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          가격:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          카테고리:
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
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
          설명:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="button" onClick={handleRegister}>
          등록
        </button>
      </form>
    </div>
  );
}

export default ItemRegister;
