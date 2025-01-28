import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getItemDetail } from "../services/ItemService";
import { fetchNickName } from "../services/ChatService";

function ItemDetail() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [nickname, setNickname] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);

  const fetchItemDetail = useCallback(async () => {
    try {
      const response = await getItemDetail(itemId);
      console.log("Item Detail Response:", response.data);
      setItem(response.data);

      const nickResponse = await fetchNickName();
      console.log("Nickname Response:", nickResponse);
      setNickname(nickResponse || "알 수 없음");
    } catch (error) {
      console.error("상품 상세 정보 불러오기 실패:", error);
    }
  }, [itemId]);

  useEffect(() => {
    fetchItemDetail();
  }, [fetchItemDetail]);

  if (!item) return <div>로딩 중...</div>;

  // 가격 비교 계산
  const priceDifference = item.price - item.myPrice;
  const priceDifferencePercentage =
    item.price > 0
      ? Math.round((priceDifference / item.price) * 100)
      : null;

  return (
    <div className="bg-gray-50 min-h-screen p-6 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl w-full flex flex-col md:flex-row gap-6">
        {/* 사진 섹션 */}
        <div className="flex-shrink-0 w-full md:w-1/2">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-auto rounded-lg object-contain"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">이미지가 없습니다</span>
            </div>
          )}
        </div>

        {/* 정보 섹션 */}
        <div className="flex flex-col justify-between md:w-1/2">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{item.itemName}</h2>

          {item.price > 0 && (
            <p className="text-gray-600 mb-2">
              <strong>정가:</strong> {item.price.toLocaleString()} 원
            </p>
          )}
          <p className="text-gray-600 mb-2">
            <strong>판매가:</strong> {item.myPrice.toLocaleString()} 원
          </p>

          {item.price > 0 && (
            <p
              className={`text-lg font-bold ${
                priceDifference > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {priceDifference > 0 ? "-" : "+"}
              {Math.abs(priceDifference).toLocaleString()} 원{" "}
              ({priceDifferencePercentage > 0 ? "-" : "+"}
              {Math.abs(priceDifferencePercentage)}%)
            </p>
          )}

          <p className="text-gray-600 mb-2">
            <strong>판매자:</strong>{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => navigate(`/shop/${item.sellerId}`)}
            >
              {nickname}
            </span>
          </p>

          {/* 설명 */}
          <p className="text-gray-600 mb-2">
            <strong>설명:</strong>{" "}
            {item.description && item.description.length > 100 ? (
              <>
                {item.description.slice(0, 100)}...
                <button
                  onClick={() => setShowFullDescription(true)}
                  className="text-blue-500 underline ml-2"
                >
                  더보기
                </button>
              </>
            ) : (
              item.description || "설명이 없습니다."
            )}
          </p>

          {/* 판매자 노트 */}
          <p className="text-gray-600 mb-2">
            <strong>판매자 노트:</strong>{" "}
            {item.note || "판매자가 내용을 작성하지 않았습니다."}
          </p>

          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline mt-4"
            >
              판매 링크 보기
            </a>
          )}

          <div className="flex gap-4 mt-6">
            <button className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600">
              찜하기
            </button>
            <button className="w-full py-2 px-4 bg-red-500 text-white font-bold rounded hover:bg-red-600">
              구매하기
            </button>
          </div>
        </div>
      </div>

      {/* 설명 팝업 */}
      {showFullDescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h3 className="text-lg font-bold mb-4">전체 설명</h3>
            <p className="text-gray-700">{item.description}</p>
            <button
              onClick={() => setShowFullDescription(false)}
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemDetail;
