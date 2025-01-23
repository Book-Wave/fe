import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getItemDetail } from "../services/ItemService";
import { fetchNickName } from "../services/ChatService";

function ItemDetail() {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [nickname, setNickname] = useState("");

  const fetchItemDetail = useCallback(async () => {
    try {
      const response = await getItemDetail(itemId);
      setItem(response.data);

      const nickResponse = await fetchNickName();
      setNickname(nickResponse|| "알 수 없음");
    } catch (error) {
      console.error("상품 상세 정보 불러오기 실패:", error);
    }
  }, [itemId]);

  useEffect(() => {
    fetchItemDetail();
  }, [fetchItemDetail]);

  if (!item) return <div>로딩 중...</div>;

  return (
    <div className="bg-gray-50 min-h-screen p-6 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl w-full flex flex-col md:flex-row gap-6">
        {/* 사진 섹션 */}
        <div className="flex-shrink-0 w-full md:w-1/2">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-auto rounded-lg object-contain"
          />
        </div>
        
        {/* 정보 섹션 */}
        <div className="flex flex-col justify-between md:w-1/2">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{item.itemName}</h2>
          <p className="text-gray-600 mb-2">
            <strong>판매자:</strong> {nickname}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>가격:</strong> {item.myPrice.toLocaleString()}원
          </p>
          <p className="text-gray-600 mb-2">
            <strong>설명:</strong> {item.description}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>판매자 노트:</strong> {item.note || "판매자가 내용을 작성하지 않았습니다."}
          </p>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline mt-4"
          >
            상세 링크 보기
          </a>
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
    </div>
  );
}

export default ItemDetail;
