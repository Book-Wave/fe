// components/ShopList.js
import React, { useState } from 'react';

const ShopList = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      title: '아이폰 14 프로 256GB',
      price: 980000,
      status: '판매중',
      imageUrl: 'https://via.placeholder.com/150',
      updatedAt: '2024-01-10',
    },
    {
      id: 2,
      title: '에어팟 프로 2세대',
      price: 250000,
      status: '예약중',
      imageUrl: 'https://via.placeholder.com/150',
      updatedAt: '2024-01-09',
    },
    {
      id: 3,
      title: '갤럭시 워치 5',
      price: 150000,
      status: '판매완료',
      imageUrl: 'https://via.placeholder.com/150',
      updatedAt: '2024-01-08',
    },
  ]);

  const [statusFilter, setStatusFilter] = useState('전체');

  const filteredProducts =
    statusFilter === '전체'
      ? products
      : products.filter((product) => product.status === statusFilter);

  const statusCounts = {
    전체: products.length,
    판매중: products.filter((p) => p.status === '판매중').length,
    예약중: products.filter((p) => p.status === '예약중').length,
    판매완료: products.filter((p) => p.status === '판매완료').length,
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

  return (
    <>
      <div className="flex space-x-4 border-b pb-4 mb-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`text-center px-4 py-2 rounded-full transition-colors duration-200 ${
              statusFilter === status
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            {status} ({count})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="relative pb-[100%]">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
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

export default ShopList;
