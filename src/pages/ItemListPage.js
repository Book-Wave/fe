// 상품 목록 페이지
import React from "react";
import ItemList from "../components/ItemList";

function ItemListPage() {
  return (
    <div>
      <h1>상품 목록</h1>
      <ItemList /> {/* 상품 목록 컴포넌트 */}
    </div>
  );
}

export default ItemListPage;
