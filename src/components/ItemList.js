import React, { useEffect, useState } from "react";
import { getPaginatedItems } from "../services/ItemService"; // API 호출 서비스
import Pagination from "./Pagination"; // 페이지네이션 컴포넌트

const ItemList = () => {
  // 상태 정의
  const [items, setItems] = useState([]); // 아이템 목록
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [pageSize] = useState(10); // 페이지당 항목 수 (고정)
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수

  useEffect(() => {
    // 데이터 가져오기 함수 호출
    const fetchItems = async () => {
      try {
        const response = await getPaginatedItems(currentPage, pageSize);
        setItems(response.data.items); // 가져온 아이템 목록 저장
        setTotalPages(response.data.totalPages); // 총 페이지 수 저장
        console.log("items : " + response.data.items) 
        console.log("data : " + response.data)
        console.log(response)
      } catch (error) {
        console.error("Failed to fetch paginated items:", error); // 에러 처리
      }
    };

    fetchItems(); // 컴포넌트 로드 또는 상태 변경 시 데이터 가져오기 실행
  }, [currentPage, pageSize]); // currentPage 또는 pageSize 변경 시 실행

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page); // 현재 페이지 상태 업데이트
  };

  return (
    <div>
      <h1>Item List</h1>
      {/* 아이템 목록 출력 */}
      <ul>
        {items.map((item) => (
          <li key={item.itemId}>{item.itemName}</li> // 각 아이템의 이름 출력
        ))}
      </ul>
      {/* 페이지네이션 컴포넌트 */}
      <Pagination
        currentPage={currentPage} // 현재 페이지 전달
        totalPages={totalPages} // 총 페이지 수 전달
        onPageChange={handlePageChange} // 페이지 변경 이벤트 전달
      />
    </div>
  );
};

export default ItemList;
