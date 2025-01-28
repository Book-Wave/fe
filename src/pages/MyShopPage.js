import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // useParams 추가
import ItemsTab from '../components/ItemsTab';
import ReviewsTab from '../components/ReviewsTab';
import ZzimsTab from '../components/ZzimsTab';
import {
  fetchShopItems,
  fetchShopReviews,
  fetchZzimlist,
} from '../services/ShopService';

const MyShopPage = () => {
  const { sellerId } = useParams(); // URL에서 sellerId 가져오기
  const [activeTab, setActiveTab] = useState('items');
  const [loading, setLoading] = useState(true);
  const [itemsCount, setItemsCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [zzimsCount, setZzimsCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // 각 데이터 로드
        const items = await fetchShopItems(sellerId);
        const reviews = await fetchShopReviews(sellerId);
        const zzims = await fetchZzimlist(sellerId);

        // 카운트 설정
        setItemsCount(Array.isArray(items) ? items.length : 0);
        setReviewsCount(Array.isArray(reviews) ? reviews.length : 0);
        setZzimsCount(Array.isArray(zzims) ? zzims.length : 0);

        console.log('Counts loaded:', {
          items: items?.length || 0,
          reviews: reviews?.length || 0,
          zzims: zzims?.length || 0,
        });
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sellerId]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'items':
        return <ItemsTab shopId={sellerId} onCountChange={setItemsCount} />;
      case 'reviews':
        return <ReviewsTab shopId={sellerId} onCountChange={setReviewsCount} />;
      case 'zzims':
        return <ZzimsTab shopId={sellerId} onCountChange={setZzimsCount} />;
      default:
        return <ItemsTab shopId={sellerId} onCountChange={setItemsCount} />;
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
              src="https://via.placeholder.com/100"
              alt="상점 프로필"
              className="w-full h-full object-cover"
            />
          </div>

          {/* 상점 정보 */}
          <div className="flex-grow">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold">{sellerId}</h1>
            </div>

            {/* 상점 통계 */}
            <div className="flex gap-4 text-gray-600 mb-4">
              <span>상품 {itemsCount}</span>
              <span>상점후기 {reviewsCount}</span>
              <span>찜 {zzimsCount}</span>
            </div>
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
          상품 {itemsCount}
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`py-3 px-6 font-medium ${
            activeTab === 'reviews'
              ? 'border-b-2 border-red-500 text-red-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          상점후기 {reviewsCount}
        </button>
        <button
          onClick={() => setActiveTab('zzims')}
          className={`py-3 px-6 font-medium ${
            activeTab === 'zzims'
              ? 'border-b-2 border-red-500 text-red-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          찜 {zzimsCount}
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="py-4">{renderTabContent()}</div>
    </div>
  );
};

export default MyShopPage;


// // pages/MyShopPage.js
// import React, { useState, useEffect } from 'react';
// import ItemsTab from '../components/ItemsTab';
// import ReviewsTab from '../components/ReviewsTab';
// import ZzimsTab from '../components/ZzimsTab';
// import { fetchNickName } from '../services/ChatService';
// import {
//   fetchShopItems,
//   fetchShopReviews,
//   fetchZzimlist,
// } from '../services/ShopService';

// const MyShopPage = () => {
//   const [activeTab, setActiveTab] = useState('items');
//   const [nickname, setNickname] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [itemsCount, setItemsCount] = useState(0);
//   const [reviewsCount, setReviewsCount] = useState(0);
//   const [zzimsCount, setZzimsCount] = useState(0);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         // 닉네임 로드
//         const name = await fetchNickName();
//         setNickname(name);
//         console.log('Loaded nickname:', name);

//         // 각 데이터 로드
//         const items = await fetchShopItems(name);
//         const reviews = await fetchShopReviews(name);
//         const zzims = await fetchZzimlist(name);

//         // 카운트 설정
//         setItemsCount(Array.isArray(items) ? items.length : 0);
//         setReviewsCount(Array.isArray(reviews) ? reviews.length : 0);
//         setZzimsCount(Array.isArray(zzims) ? zzims.length : 0);

//         console.log('Counts loaded:', {
//           items: items?.length || 0,
//           reviews: reviews?.length || 0,
//           zzims: zzims?.length || 0,
//         });
//       } catch (error) {
//         console.error('데이터 로드 실패:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   // 상점 정보 데이터
//   const shopInfo = {
//     name: nickname || '로딩중...',
//     profileImage: 'https://via.placeholder.com/100',
//   };

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'items':
//         return <ItemsTab shopId={nickname} onCountChange={setItemsCount} />;
//       case 'reviews':
//         return <ReviewsTab shopId={nickname} onCountChange={setReviewsCount} />;
//       case 'zzims':
//         return <ZzimsTab shopId={nickname} onCountChange={setZzimsCount} />;
//       default:
//         return <ItemsTab shopId={nickname} onCountChange={setItemsCount} />;
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-8">로딩 중...</div>;
//   }

//   return (
//     <div className="max-w-screen-xl mx-auto px-4">
//       {/* 상점 정보 섹션 */}
//       <div className="py-6 border-b">
//         <div className="flex items-start gap-6">
//           {/* 프로필 이미지 */}
//           <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
//             <img
//               src={shopInfo.profileImage}
//               alt="상점 프로필"
//               className="w-full h-full object-cover"
//             />
//           </div>

//           {/* 상점 정보 */}
//           <div className="flex-grow">
//             <div className="flex justify-between items-start mb-4">
//               <h1 className="text-2xl font-bold">{shopInfo.name}</h1>
//               <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-200">
//                 상품 등록
//               </button>
//             </div>

//             {/* 상점 통계 */}
//             <div className="flex gap-4 text-gray-600 mb-4">
//               <span>상품 {itemsCount}</span>
//             </div>

//             {/* 상점 소개 */}
//             <p className="text-gray-600">{shopInfo.description}</p>
//           </div>
//         </div>
//       </div>

//       {/* 탭 메뉴 */}
//       <div className="flex border-b mt-4">
//         <button
//           onClick={() => setActiveTab('items')}
//           className={`py-3 px-6 font-medium ${
//             activeTab === 'items'
//               ? 'border-b-2 border-red-500 text-red-500'
//               : 'text-gray-500 hover:text-gray-700'
//           }`}
//         >
//           상품 {itemsCount}
//         </button>
//         <button
//           onClick={() => setActiveTab('reviews')}
//           className={`py-3 px-6 font-medium ${
//             activeTab === 'reviews'
//               ? 'border-b-2 border-red-500 text-red-500'
//               : 'text-gray-500 hover:text-gray-700'
//           }`}
//         >
//           상점후기 {reviewsCount}
//         </button>
//         <button
//           onClick={() => setActiveTab('zzims')}
//           className={`py-3 px-6 font-medium ${
//             activeTab === 'zzims'
//               ? 'border-b-2 border-red-500 text-red-500'
//               : 'text-gray-500 hover:text-gray-700'
//           }`}
//         >
//           찜 {zzimsCount}
//         </button>
//       </div>

//       {/* 탭 컨텐츠 */}
//       <div className="py-4">{renderTabContent()}</div>
//     </div>
//   );
// };

// export default MyShopPage;
