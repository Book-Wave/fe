// pages/MyShop.js
import React, { useState, useEffect } from 'react';
import MyShopList from '../components/MyShopList';
import * as ShopService from '../services/ShopService';

const MyShopPage = ({ shopId }) => {
  const [activeTab, setActiveTab] = useState('상품');
  const [isMyShop, setIsMyShop] = useState(false);
  const [shopInfo, setShopInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const loginUser = JSON.parse(localStorage.getItem('user'));
    setIsMyShop(loginUser?.id === shopId);

    const loadShopInfo = async () => {
      try {
        const info = await ShopService.fetchShopInfo(shopId);
        setShopInfo(info);
      } catch (error) {
        console.error('상점 정보 로드 실패:', error);
      }
    };

    loadShopInfo();
  }, [shopId]);

  useEffect(() => {
    const loadTabData = async () => {
      try {
        switch (activeTab) {
          case '상품': {
            const products = await ShopService.fetchShopProducts(shopId);
            setProducts(products);
            break;
          }
          case '상점후기': {
            const reviews = await ShopService.fetchShopReviews(shopId);
            setReviews(reviews);
            break;
          }
          case '팔로잉': {
            const following = await ShopService.fetchFollowList(
              shopId,
              'following'
            );
            setFollowing(following);
            break;
          }
          case '팔로워': {
            const followers = await ShopService.fetchFollowList(
              shopId,
              'followers'
            );
            setFollowers(followers);
            break;
          }
          case '찜': {
            const wishlist = await ShopService.fetchWishlist(shopId);
            setWishlist(wishlist);
            break;
          }
          default:
            break;
        }
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      }
    };

    loadTabData();
  }, [activeTab, shopId]);

  const tabs = [
    { id: '상품', label: `상품 ${products.length}` },
    { id: '상점후기', label: `상점후기 ${reviews.length}` },
    { id: '팔로잉', label: `팔로잉 ${following.length}` },
    { id: '팔로워', label: `팔로워 ${followers.length}` },
    ...(isMyShop ? [{ id: '찜', label: `찜 ${wishlist.length}` }] : []),
  ];

  const handleProductRegister = async (productData) => {
    try {
      await ShopService.createProduct(productData);
      // 상품 등록 후 목록 새로고침
      const updatedProducts = await ShopService.fetchShopProducts(shopId);
      setProducts(updatedProducts);
    } catch (error) {
      console.error('상품 등록 실패:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '상품':
        return (
          <>
            <div className="flex justify-between items-center my-4">
              <h2 className="text-xl font-bold">상품</h2>
              {isMyShop && (
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-200"
                  onClick={() => handleProductRegister()}
                >
                  상품 등록
                </button>
              )}
            </div>
            <MyShopList products={products} />
          </>
        );
      case '상점후기':
        return (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border p-4 rounded">
                <p>{review.content}</p>
              </div>
            ))}
          </div>
        );
      case '팔로잉':
        return (
          <div className="grid grid-cols-2 gap-4">
            {following.map((user) => (
              <div
                key={user.id}
                className="border p-4 rounded flex items-center"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        );
      case '팔로워':
        return (
          <div className="grid grid-cols-2 gap-4">
            {followers.map((user) => (
              <div
                key={user.id}
                className="border p-4 rounded flex items-center"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        );
      case '찜':
        return (
          <div className="grid grid-cols-4 gap-4">
            {wishlist.map((item) => (
              <div key={item.id} className="border p-4 rounded">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover mb-2"
                />
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-red-500">{item.price}원</p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      {/* 상점 프로필 섹션 */}
      <div className="border-b pb-6">
        <div className="flex items-start gap-6 my-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
            <img
              src={shopInfo?.profileImage || 'https://via.placeholder.com/150'}
              alt="프로필 이미지"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">
              {shopInfo?.name || '상점명'}
            </h1>
            <div className="flex gap-4 text-sm text-gray-600 mb-4">
              <span>상품 {products.length}</span>
              <span>팔로워 {followers.length}</span>
              <span>팔로잉 {following.length}</span>
            </div>
            <p className="text-gray-700 whitespace-pre-line">
              {shopInfo?.description || '상점 소개가 없습니다.'}
            </p>
          </div>
          {!isMyShop && (
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              팔로우
            </button>
          )}
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="border-b mb-6">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 relative ${
                activeTab === tab.id
                  ? 'text-red-500 font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      {renderTabContent()}
    </div>
  );
};

export default MyShopPage;
