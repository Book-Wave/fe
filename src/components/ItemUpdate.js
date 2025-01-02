import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getItemDetail,getCategories,updateItem } from "../services/ItemService";

function ItemUpdate() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
  });
  const [categories, setCategories] = useState([]);

  const fetchData = async () => {
    try {
      const [itemResponse, categoriesResponse] = await Promise.all([
        getItemDetail(itemId),
        getCategories(),
      ]);
      setFormData(itemResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [itemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updateItem(itemId, formData);
      alert("수정 성공!");
      navigate(`/items/${itemId}`);
    } catch (error) {
      console.error("수정 실패:", error);
    }
  };

  return (
    <div>
      <h2>상품 수정</h2>
      <form>
        <label>
          상품명:
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </label>
        <br />
        <label>
          가격:
          <input type="number" name="price" value={formData.price} onChange={handleChange} />
        </label>
        <br />
        <label>
          카테고리:
          <select name="category" value={formData.category} onChange={handleChange}>
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
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </label>
        <br />
        <button type="button" onClick={handleSubmit}>
          수정
        </button>
      </form>
    </div>
  );
}

export default ItemUpdate;
