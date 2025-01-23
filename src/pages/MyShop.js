import React from 'react';

const MyShop = () => {
  const shopInfo = {
    name: '내 상점',
    rating: 4.8,
    followers: 128,
    following: 45,
    sales: 24,
    reviews: 18,
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-start py-5">
        <div className="flex gap-4">
          <img
            alt="프로필 이미지"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold">{shopInfo.name}</h1>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-500">상점평점</span>
                <span className="text-sm font-bold">{shopInfo.rating}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-500">팔로워</span>
                <span className="text-sm font-bold">{shopInfo.followers}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-500">팔로잉</span>
                <span className="text-sm font-bold">{shopInfo.following}</span>
              </div>
            </div>
          </div>
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
          상점 수정
        </button>
      </div>

      <div className="flex border-b border-gray-200 mt-5">
        <button className="flex-1 py-3 hover:text-red-500">
          판매상품 {shopInfo.sales}
        </button>
        <button className="flex-1 py-3 hover:text-red-500">
          상점후기 {shopInfo.reviews}
        </button>
        <button className="flex-1 py-3 hover:text-red-500">찜목록</button>
        <button className="flex-1 py-3 hover:text-red-500">상점문의</button>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-5">
        {/* 상품 목록이 들어갈 자리 */}
      </div>
    </div>
  );
};

export default MyShop;
