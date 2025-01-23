import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // 버튼 클릭 이벤트 핸들러
  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page); // 유효한 페이지 번호일 경우 페이지 변경
    }
  };

  return (
    <div className="flex justify-center items-center mt-6 space-x-2">
      {/* 이전 버튼 */}
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded-l-lg bg-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
      >
        Previous
      </button>
      {/* 페이지 번호 버튼 */}
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => handleClick(index + 1)} // 클릭 시 해당 페이지로 이동
          className={`px-4 py-2 border bg-white text-gray-600 hover:bg-gray-100 transition duration-200 ${
            currentPage === index + 1 ? "bg-blue-500 text-white font-bold" : ""
          }`}
        >
          {index + 1} {/* 페이지 번호 표시 */}
        </button>
      ))}
      {/* 다음 버튼 */}
      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border rounded-r-lg bg-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;