// 페이지네이션 컴포넌트
import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div>
      {/* 이전 페이지 버튼 */}
      <button
        disabled={currentPage === 1} // 첫 페이지에서는 비활성화
        onClick={() => onPageChange(currentPage - 1)}
      >
        이전
      </button>

      {/* 페이지 번호 리스트 */}
      {[...Array(totalPages).keys()].map((num) => (
        <button
          key={num + 1} // 고유 키 설정
          onClick={() => onPageChange(num + 1)} // 페이지 변경
          style={{
            fontWeight: num + 1 === currentPage ? "bold" : "normal", // 현재 페이지 강조
          }}
        >
          {num + 1}
        </button>
      ))}

      {/* 다음 페이지 버튼 */}
      <button
        disabled={currentPage === totalPages} // 마지막 페이지에서는 비활성화
        onClick={() => onPageChange(currentPage + 1)}
      >
        다음
      </button>
    </div>
  );
}

export default Pagination;
