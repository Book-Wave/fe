// components/EditItemsTab.js
import React, { useState, useEffect } from 'react';
import {
  fetchShopItems,
  deleteItem,
  updateItem,
} from '../services/ShopService';
import { useNavigate } from 'react-router-dom';

const EditItemsTab = ({ shopId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadItems();
  }, [shopId]);

  const loadItems = async () => {
    try {
      const response = await fetchShopItems(shopId);
      const formattedItems = response.map((item) => ({
        id: item.itemId,
        title: item.title,
        price: item.price,
        status: item.status,
        imageUrl: item.image || '/fallback-image.png',
        updatedAt: item.modDate,
      }));
      setItems(formattedItems);
    } catch (err) {
      setError('상품 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      try {
        await deleteItem(itemId);
        setItems(items.filter((item) => item.id !== itemId));
      } catch (err) {
        alert('상품 삭제에 실패했습니다.');
      }
    }
  };

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      await updateItem(itemId, { status: newStatus });
      setItems(
        items.map((item) =>
          item.id === itemId ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      alert('상태 변경에 실패했습니다.');
    }
  };

  const handleEdit = (itemId) => {
    navigate(`/items/${itemId}/update`);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return '판매중';
      case 1:
        return '예약중';
      case 2:
        return '판매완료';
      default:
        return '판매중';
    }
  };

  if (loading) return <div className="text-center py-8">로딩 중...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">상품 관리</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상품 정보
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가격
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                등록일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-16 w-16 flex-shrink-0">
                      <img
                        className="h-16 w-16 object-cover rounded"
                        src={item.imageUrl}
                        alt={item.title}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {item.title}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {item.price.toLocaleString()}원
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={item.status}
                    onChange={(e) =>
                      handleStatusChange(item.id, parseInt(e.target.value))
                    }
                    className="text-sm rounded border-gray-300"
                  >
                    <option value={0}>판매중</option>
                    <option value={1}>예약중</option>
                    <option value={2}>판매완료</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.updatedAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          등록된 상품이 없습니다.
        </div>
      )}
    </div>
  );
};

export default EditItemsTab;
