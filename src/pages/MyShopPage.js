import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as ShopService from '../services/ShopService';

const MyShopPage = () => {
  const { nickname } = useParams();
  const navigate = useNavigate();
  const decodedNickname = decodeURIComponent(nickname);

  const [activeTab, setActiveTab] = useState('상품');
  const [isMyShop, setIsMyShop] = useState(false);
  const [shopInfo, setShopInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const loginUser = JSON.parse(localStorage.getItem('user'));
    setIsMyShop(loginUser?.nickname === decodedNickname);

    const loadShopInfo = async () => {
      try {
        const info = await ShopService.fetchShopInfo(decodedNickname);
        setShopInfo(info);
      } catch (error) {
        console.error('상점 정보 로드 실패:', error);
      }
    };

    loadShopInfo();
  }, [decodedNickname]);

  useEffect(() => {
    const loadTabData = async () => {
      try {
        switch (activeTab) {
          case '상품': {
            const products = await ShopService.fetchShopProducts(
              decodedNickname
            );
            setProducts(products);
            break;
          }
          case '상점후기': {
            const reviews = await ShopService.fetchShopReviews(decodedNickname);
            setReviews(reviews);
            break;
          }
          case '찜': {
            if (isMyShop) {
              const wishlist = await ShopService.fetchWishlist(decodedNickname);
              setWishlist(wishlist);
            }
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
  }, [activeTab, decodedNickname, isMyShop]);

  const tabs = [
    { id: '상품', label: `상품 ${products.length}` },
    { id: '상점후기', label: `상점후기 ${reviews.length}` },
    ...(isMyShop
      ? [
          { id: '찜', label: `찜 ${wishlist.length}` },
          { id: '상품관리', label: '상품관리' },
        ]
      : []),
  ];

  const handleProductRegister = () => {
    navigate('/items/register');
  };

  const handleProductUpdate = (productId) => {
    navigate(`/items/${productId}/update`);
  };

  const handleProductDelete = async (productId) => {
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      try {
        await ShopService.deleteProduct(productId);
        const updatedProducts = await ShopService.fetchShopProducts(
          decodedNickname
        );
        setProducts(updatedProducts);
      } catch (error) {
        console.error('상품 삭제 실패:', error);
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '상품':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/items/${item.id}`)}
              >
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={item.image || 'default-product-image.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-red-500 font-bold">
                    {item.price.toLocaleString()}원
                  </p>
                </div>
              </div>
            ))}
          </div>
        );

      case '상품관리':
        if (!isMyShop) return null;
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold">상품 관리</h2>
              <button
                onClick={handleProductRegister}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                새 상품 등록
              </button>
            </div>

            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={product.image || 'default-product-image.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold text-lg mb-1">
                          {product.name}
                        </h3>
                        <p className="text-red-500 font-medium">
                          {product.price.toLocaleString()}원
                        </p>
                        <div className="flex space-x-4 text-sm text-gray-500 mt-1">
                          <span>조회 {product.view}</span>
                          <span>•</span>
                          <span>
                            {product.status === 1 ? '판매중' : '판매완료'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductUpdate(product.id);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        수정
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductDelete(product.id);
                        }}
                        className="px-4 py-2 border border-red-300 text-red-500 rounded-lg hover:bg-red-50 transition-colors duration-200"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case '상점후기':
        return (
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-4 rounded-lg shadow-sm"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <img
                      src={review.userImage || 'default-avatar.jpg'}
                      alt={review.userName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-medium">{review.userName}</span>
                  </div>
                  <p className="text-gray-700">{review.content}</p>
                  <div className="text-sm text-gray-500 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                아직 상점 후기가 없습니다.
              </div>
            )}
          </div>
        );

      case '찜':
        if (!isMyShop) return null;
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/items/${item.id}`)}
              >
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={item.image || 'default-product-image.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-red-500 font-bold">
                    {item.price.toLocaleString()}원
                  </p>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={shopInfo?.profileImage || 'default-profile-image.jpg'}
              alt="프로필 이미지"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">
              {shopInfo?.name || decodedNickname}의 상점
            </h1>
            <p className="text-gray-700 whitespace-pre-line">
              {shopInfo?.description || '상점 소개가 없습니다.'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex space-x-8 px-6">
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

      <div className="bg-white rounded-lg shadow-sm p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default MyShopPage;
