import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchShopItems } from '../services/ShopService';

const ItemsTab = ({ shopId, onCountChange }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('전체');

  useEffect(() => {
    const loadShopItems = async () => {
      try {
        if (!shopId) return;
        const response = await fetchShopItems(shopId);
        const data = Array.isArray(response) ? response : [];

        const formattedProducts = data.map((item, index) => ({
          id: item.itemId || `temp-${index}`,
          title: item.title,
          price: item.price,
          status: getStatusText(item.status),
          imageUrl: item.image || null,
          updatedAt: item.modDate,
        }));

        setProducts(formattedProducts);
        onCountChange?.(formattedProducts.length);
      } catch (err) {
        console.error('상품 목록을 불러오는데 실패했습니다:', err);
        setError('상품 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadShopItems();
  }, [shopId, onCountChange]);

  const handleItemClick = (itemId) => {
    navigate(`/items/${itemId}`);
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

  const filteredProducts =
    statusFilter === '전체'
      ? products
      : products.filter((product) => product.status === statusFilter);

  const statusFilters = [
    { id: 'all', label: '전체', count: products.length },
    {
      id: 'selling',
      label: '판매중',
      count: products.filter((p) => p.status === '판매중').length,
    },
    {
      id: 'reserved',
      label: '예약중',
      count: products.filter((p) => p.status === '예약중').length,
    },
    {
      id: 'sold',
      label: '판매완료',
      count: products.filter((p) => p.status === '판매완료').length,
    },
  ];

  const formatPrice = (price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
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
  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        등록된 상품이 없습니다.
      </div>
    );
  }

  return (
    <>
      <div className="flex space-x-4 border-b pb-4 mb-4">
        {statusFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setStatusFilter(filter.label)}
            className={`text-center px-4 py-2 rounded-full transition-colors duration-200 ${
              statusFilter === filter.label
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            onClick={() => handleItemClick(product.id)}
            className="group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
          >
            <div className="relative pb-[100%]">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">이미지 없음</span>
                </div>
              )}
              {product.status === '판매완료' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">판매완료</span>
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium truncate">{product.title}</h3>
              <div className="mt-1 flex justify-between items-center">
                <span className="text-lg font-bold">
                  {formatPrice(product.price)}원
                </span>
                <span
                  className={`text-sm px-2 py-1 rounded-full ${getStatusStyle(
                    product.status
                  )}`}
                >
                  {product.status}
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {product.updatedAt}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ItemsTab;
