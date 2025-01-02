import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getItemDetail } from "../services/ItemService";

function ItemDetail() {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);

  const fetchItemDetail = useCallback(async () => {
    try {
      const response = await getItemDetail(itemId);
      setItem(response.data);
    } catch (error) {
      console.error("상품 상세 정보 불러오기 실패:", error);
    }
  }, [itemId]);

  useEffect(() => {
    fetchItemDetail();
  }, [fetchItemDetail]);

  if (!item) return <div>로딩 중...</div>;

  return (
    <div>
      <h2>상품 상세 정보</h2>
      <p><strong>상품명:</strong> {item.title}</p>
      <p><strong>가격:</strong> {item.price}</p>
      <p><strong>카테고리:</strong> {item.category}</p>
      <p><strong>설명:</strong> {item.description}</p>
      <button onClick={() => window.location.href = `/items/${item.itemId}/update`}>
        수정
      </button>
    </div>
  );
}

export default ItemDetail;
