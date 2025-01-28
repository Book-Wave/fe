// components/ReviewsTab.js
import React, { useState, useEffect } from 'react';
import { fetchShopReviews } from '../services/ShopService';

const ReviewsTab = ({ shopId, onCountChange }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        console.log('Loading reviews for shopId:', shopId);
        if (!shopId) return;

        const response = await fetchShopReviews(shopId);
        console.log('Reviews API Response:', response);

        const data = Array.isArray(response) ? response : [];
        console.log('Formatted review data:', data);

        setReviews(data);

        // 리뷰 개수 업데이트
        onCountChange?.(data.length);
      } catch (err) {
        console.error('Reviews loading error:', err);
        setError('후기를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [shopId, onCountChange]);

  const getReviewText = (review) => {
    const reviewPoints = [];
    if (review.one) reviewPoints.push('상품상태가 설명한 것과 같아요');
    if (review.two) reviewPoints.push('응답이 빨라요');
    if (review.three) reviewPoints.push('친절하고 매너가 좋아요');
    if (review.four) reviewPoints.push('시간 약속을 잘 지켜요');
    if (review.five) reviewPoints.push('거래 장소를 잘 정해요');
    return reviewPoints;
  };

  if (loading) return <div className="text-center py-8">로딩 중...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        아직 상점 후기가 없습니다.
      </div>
    );
  }

  // 리뷰 통계 계산
  const totalReviews = reviews.length;
  const reviewStats = {
    one: reviews.filter((r) => r.one).length,
    two: reviews.filter((r) => r.two).length,
    three: reviews.filter((r) => r.three).length,
    four: reviews.filter((r) => r.four).length,
    five: reviews.filter((r) => r.five).length,
  };

  const calculatePercentage = (count) => {
    if (totalReviews === 0) return 0;
    return Math.round((count / totalReviews) * 100);
  };

  return (
    <div className="py-4">
      {/* 리뷰 통계 */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-bold mb-4">
          받은 상점 후기 {totalReviews}개
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              {calculatePercentage(reviewStats.one)}%
            </div>
            <span>상품상태가 설명한 것과 같아요</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              {calculatePercentage(reviewStats.two)}%
            </div>
            <span>응답이 빨라요</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              {calculatePercentage(reviewStats.three)}%
            </div>
            <span>친절하고 매너가 좋아요</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              {calculatePercentage(reviewStats.four)}%
            </div>
            <span>시간 약속을 잘 지켜요</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              {calculatePercentage(reviewStats.five)}%
            </div>
            <span>거래 장소를 잘 정해요</span>
          </div>
        </div>
      </div>

      {/* 개별 리뷰 목록 */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                B
              </div>
              <div className="flex-1">
                <h4 className="font-medium">구매자{review.buyerId}</h4>
                <div className="mt-2 space-y-1">
                  {getReviewText(review).map((text, i) => (
                    <div
                      key={i}
                      className="text-sm text-gray-600 flex items-center gap-2"
                    >
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsTab;
