// components/ZzimTab.js
import React, { useState, useEffect } from 'react';
import { fetchZzimlist } from '../services/ShopService';

const ZzimsTab = ({ shopId, onCountChange }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadZzimItems = async () => {
      try {
        console.log('Loading zzim items for shopId:', shopId);
        if (!shopId) return;

        const response = await fetchZzimlist(shopId);
        console.log('Zzim API Response:', response);

        const data = Array.isArray(response) ? response : [];
        console.log('Formatted zzim data:', data);

        const formattedItems = data.map((item) => ({
          id: item.itemId,
          title: item.title,
          price: item.price,
          status: getStatusText(item.status),
          imageUrl: item.image || '/fallback-image.png',
          updatedAt: item.regDate,
        }));

        console.log('Final formatted zzim items:', formattedItems);
        setItems(formattedItems);

        // 찜 개수 업데이트
        onCountChange?.(formattedItems.length);
      } catch (err) {
        console.error('Zzim loading error:', err);
        setError('찜한 상품 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadZzimItems();
  }, [shopId, onCountChange]);

  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
  };

  const getStatusText = (statusCode) => {
    switch (statusCode) {
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

  const getStatusStyle = (status) => {
    switch (status) {
      case '판매중':
        return 'text-green-600 bg-green-50';
      case '예약중':
        return 'text-yellow-600 bg-yellow-50';
      case '판매완료':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) return <div className="text-center py-8">로딩 중...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <div className="mb-4">😊</div>
        <div>찜한 상품이 없습니다.</div>
        <div className="mt-2 text-sm">마음에 드는 상품을 찜해보세요!</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 text-sm text-gray-600">전체 {items.length}개</div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="relative pb-[100%]">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  console.log('Image load error:', item.title);
                  e.target.src = '/fallback-image.png';
                }}
              />
              {item.status === '판매완료' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">판매완료</span>
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium truncate">{item.title}</h3>
              <div className="mt-1 flex justify-between items-center">
                <span className="text-lg font-bold">
                  {formatPrice(item.price)}원
                </span>
                <span
                  className={`text-sm px-2 py-1 rounded-full ${getStatusStyle(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-500">{item.updatedAt}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ZzimsTab;
