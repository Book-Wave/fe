import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // 버튼 클릭 이벤트 핸들러
  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page); // 유효한 페이지 번호일 경우 페이지 변경
    }
  };

  return (
    <div className="pagination">
      {/* 이전 버튼 */}
      <button onClick={() => handleClick(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </button>
      {/* 페이지 번호 버튼 */}
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => handleClick(index + 1)} // 클릭 시 해당 페이지로 이동
          className={currentPage === index + 1 ? "active" : ""} // 현재 페이지 강조
        >
          {index + 1} {/* 페이지 번호 표시 */}
        </button>
      ))}
      {/* 다음 버튼 */}
      <button onClick={() => handleClick(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
