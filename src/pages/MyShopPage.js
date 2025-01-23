// pages/MyShopPage.js
import React, { useState, useEffect } from 'react';
import ItemsTab from '../components/ItemsTab';
import ReviewsTab from '../components/ReviewsTab';
import ZzimsTab from '../components/ZzimsTab';
import { fetchNickName } from '../services/ChatService';

const MyShopPage = () => {
  const [activeTab, setActiveTab] = useState('items');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNickname = async () => {
      try {
        const name = await fetchNickName();
        setNickname(name);
      } catch (error) {
        console.error('닉네임 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNickname();
  }, []);

  // 임시 상점 정보 데이터
  const shopInfo = {
    name: nickname || '로딩중...',
    openDate: '2023.01',
    products: 123,
    followers: 45,
    following: 67,
    description: '신뢰할 수 있는 거래를 약속드립니다.',
    profileImage: 'https://via.placeholder.com/100',
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'items':
        return <ItemsTab shopId={nickname} />;
      case 'reviews':
        return <ReviewsTab shopId={nickname} />;
      case 'zzims':
        return <ZzimsTab shopId={nickname} />;
      default:
        return <ItemsTab shopId={nickname} />;
    }
  };

  if (loading) {
    return <div className="text-center py-8">로딩 중...</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      {/* 상점 정보 섹션 */}
      <div className="py-6 border-b">
        <div className="flex items-start gap-6">
          {/* 프로필 이미지 */}
          <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={shopInfo.profileImage}
              alt="상점 프로필"
              className="w-full h-full object-cover"
            />
          </div>

          {/* 상점 정보 */}
          <div className="flex-grow">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold">{shopInfo.name}</h1>
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-200">
                상품 등록
              </button>
            </div>

            {/* 상점 통계 */}
            <div className="flex gap-4 text-gray-600 mb-4">
              <span>상품 {shopInfo.products}</span>
              <span>팔로워 {shopInfo.followers}</span>
              <span>팔로잉 {shopInfo.following}</span>
            </div>

            {/* 상점 소개 */}
            <p className="text-gray-600">{shopInfo.description}</p>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex border-b mt-4">
        <button
          onClick={() => setActiveTab('items')}
          className={`py-3 px-6 font-medium ${
            activeTab === 'items'
              ? 'border-b-2 border-red-500 text-red-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          상품 {shopInfo.products}
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`py-3 px-6 font-medium ${
            activeTab === 'reviews'
              ? 'border-b-2 border-red-500 text-red-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          상점후기
        </button>
        <button
          onClick={() => setActiveTab('zzims')}
          className={`py-3 px-6 font-medium ${
            activeTab === 'zzims'
              ? 'border-b-2 border-red-500 text-red-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          찜
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="py-4">{renderTabContent()}</div>
    </div>
  );
};

export default MyShopPage;
