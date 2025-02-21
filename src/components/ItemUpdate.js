import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getItemDetail,
  getCategories,
  updateItem,
} from '../services/ItemService';

function ItemUpdate() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    description: '',
    status: 0,
    image: '',
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itemResponse, categoriesResponse] = await Promise.all([
          getItemDetail(itemId),
          getCategories(),
        ]);

        setFormData({
          title: itemResponse.data.title || '',
          price: itemResponse.data.price || '',
          category: itemResponse.data.category || '',
          description: itemResponse.data.description || '',
          status: itemResponse.data.status || 0,
          image: itemResponse.data.image || '',
        });
        setCategories(categoriesResponse.data);
      } catch (err) {
        setError('데이터를 불러오는데 실패했습니다.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchData();
    }
  }, [itemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateItem(itemId, formData);
      alert('상품이 성공적으로 수정되었습니다.');
      navigate(`/items/${itemId}`);
    } catch (error) {
      alert('상품 수정에 실패했습니다.');
      console.error('Update failed:', error);
    }
  };

  if (loading) return <div className="text-center py-8">로딩 중...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">상품 수정</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            상품명
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            가격
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            카테고리
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">카테고리 선택</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            상품 상태
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value={0}>판매중</option>
              <option value={1}>예약중</option>
              <option value={2}>판매완료</option>
            </select>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            설명
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            수정
          </button>
        </div>
      </form>
    </div>
  );
}

export default ItemUpdate;
