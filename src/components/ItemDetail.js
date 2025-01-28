import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate 추가
import { getItemDetail } from '../services/ItemService';
import { fetchNickName, createRoom } from '../services/ChatService'; // createRoom 추가

function ItemDetail() {
  const { itemId } = useParams();
  const navigate = useNavigate(); // navigate 추가
  const [item, setItem] = useState(null);
  const [nickname, setNickname] = useState('');
  const [currentUserNickname, setCurrentUserNickname] = useState(''); // 현재 사용자 닉네임 추가

  const fetchItemDetail = useCallback(async () => {
    try {
      const response = await getItemDetail(itemId);
      setItem(response.data);

      // 판매자 닉네임 설정
      const sellerNickname = await fetchNickName();
      setNickname(sellerNickname || '알 수 없음');

      // 현재 사용자 닉네임 설정
      const currentUser = await fetchNickName();
      setCurrentUserNickname(currentUser || '알 수 없음');
    } catch (error) {
      console.error('상품 상세 정보 불러오기 실패:', error);
    }
  }, [itemId]);

  useEffect(() => {
    fetchItemDetail();
  }, [fetchItemDetail]);

  // 구매하기 버튼 클릭 핸들러
  const handlePurchase = async () => {
    try {
      // 판매자와 동일한 사용자인 경우
      if (currentUserNickname === nickname) {
        alert('자신의 상품은 구매할 수 없습니다.');
        return;
      }

      // 채팅방 생성
      const roomData = await createRoom(currentUserNickname, nickname);

      // 첫 메시지 설정
      const initialMessage = `상품: ${
        item.itemName
      }\n가격: ${item.myPrice.toLocaleString()}원\n구매 문의드립니다.`;

      // 채팅방으로 이동
      navigate(`/chat/room/${roomData.roomId}`, {
        state: { initialMessage },
      });
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
      alert('채팅방 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (!item) return <div>로딩 중...</div>;

  return (
    <div className="bg-gray-50 min-h-screen p-6 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl w-full flex flex-col md:flex-row gap-6">
        {/* 기존 코드 유지 */}
        <div className="flex-shrink-0 w-full md:w-1/2">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-auto rounded-lg object-contain"
          />
        </div>

        <div className="flex flex-col justify-between md:w-1/2">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {item.itemName}
          </h2>
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
            <strong>판매자 노트:</strong>{' '}
            {item.note || '판매자가 내용을 작성하지 않았습니다.'}
          </p>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline mt-4"
            >
              상세 링크 보기
            </a>
          )}
          <div className="flex gap-4 mt-6">
            <button className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600">
              찜하기
            </button>
            <button
              onClick={handlePurchase}
              className="w-full py-2 px-4 bg-red-500 text-white font-bold rounded hover:bg-red-600"
            >
              구매하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
