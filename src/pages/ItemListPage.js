import React, { useEffect, useState } from "react";
import { getPaginatedItems } from "../services/ItemService";
import { Link } from "react-router-dom";

const ItemListPage = () => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);

        // 초기 데이터 로드
        const response = await getPaginatedItems(1, pageSize);
        console.log("Initial Items:", response.data.items); // 데이터를 로그로 확인
        setItems(response.data.items);
        setHasMore(response.data.currentPage < response.data.totalPages);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [pageSize]);

  const fetchMoreItems = async () => {
    if (!hasMore || isLoading) return;

    try {
      setIsLoading(true);
      const nextPage = currentPage + 1;
      const response = await getPaginatedItems(nextPage, pageSize);
      console.log(`Fetched Page ${nextPage}:`, response.data.items); // 추가 로드된 데이터 로그
      setItems((prevItems) => [...prevItems, ...response.data.items]);
      setCurrentPage(nextPage);
      setHasMore(nextPage < response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch more items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !isLoading
      ) {
        fetchMoreItems();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMore, fetchMoreItems]);

  return (
    <div className="bg-gray-50 flex justify-center py-6">
      <div className="w-full max-w-screen-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          상품 목록
        </h1>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item, index) => {
            console.log(`Item ${index} - ID: ${item.itemId}, myPrice: ${item.myPrice}`); // 각각의 item 로그

            return (
              <Link
                to={`/items/${item.itemId}`}
                key={item.itemId}
                className="group border rounded-lg p-3 bg-white shadow hover:shadow-lg transition"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title || "이미지 없음"}
                    className="w-full h-40 object-cover rounded-md mb-2"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 rounded-md mb-2 flex items-center justify-center text-gray-500">
                    이미지 없음
                  </div>
                )}
                <div>
                  <h3 className="text-gray-900 font-semibold text-sm truncate">
                    {item.itemName}
                  </h3>
                  {item.title && (
                    <p className="text-sm text-gray-600 truncate">
                      제목: {item.title}
                    </p>
                  )}
                  <p className="text-lg font-bold text-gray-800 mt-1">
                    {item.myPrice
                      ? `${item.myPrice.toLocaleString()} 원`
                      : "가격 정보 없음"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        {isLoading && (
          <div className="text-center mt-4">
            <p>로딩 중...</p>
          </div>
        )}
        {!hasMore && (
          <div className="text-center mt-4">
            <p>더 이상 상품이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemListPage;
