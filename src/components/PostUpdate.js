import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";

function PostUpdate() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [postData, setPostData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    notes: "",
  });
  const [categories, setCategories] = useState([]);

  const fetchPostData = async () => {
    try {
      const [postResponse, categoriesResponse] = await Promise.all([
        api.getPostDetail(postId),
        api.getCategories(),
      ]);
      setPostData(postResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error("게시물 데이터 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchPostData();
  }, [postId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await api.updatePost(postId, postData);
      alert("수정 성공!");
      navigate(`/posts/${postId}`);
    } catch (error) {
      console.error("수정 실패:", error);
    }
  };

  return (
    <div>
      <h2>게시물 수정</h2>
      <form>
        <label>
          제목:
          <input
            type="text"
            name="title"
            value={postData.title}
            onChange={handleInputChange}
          />
        </label>
        <br />
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
          수정
        </button>
      </form>
    </div>
  );
}

export default PostUpdate;
