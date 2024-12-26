import React, { useEffect, useState } from "react";
import { api } from "../services/api"; // API 호출 서비스
import Pagination from "./Pagination"; // 페이지네이션 컴포넌트

function ItemList() {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchItems = async (page) => {
    try {
      const response = await api.getPaginatedItems(page, 10);
      setItems(response.data.items);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("상품 목록 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchItems(1);
  }, []);

  const handlePageChange = (page) => {
    fetchItems(page);
  };

  return (
    <div>
      <h2>상품 목록</h2>
      <table>
        <thead>
          <tr>
            <th>상품명</th>
            <th>가격</th>
            <th>카테고리</th>
            <th>상세보기</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.itemId}>
              <td>{item.title}</td>
              <td>{item.price}</td>
              <td>{item.category}</td>
              <td>
                <button onClick={() => window.location.href = `/items/${item.itemId}`}>
                  상세보기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}

export default ItemList;
