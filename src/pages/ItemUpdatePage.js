import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getItemDetail, updateItem } from '../services/ItemService';
import BookSearch from '../components/BookSearch';

const ItemUpdatePage = () => {
  const { itemId } = useParams(); // URL에서 itemId 가져오기

  const [item, setItem] = useState({
    itemName: '',
    category: '',
    myPrice: '',
    note: '',
    author: '',
    description: '',
    publisher: '',
    price: '',
    link: '',
    image: '',
  }); // 기존 데이터 상태
  const [bookInfo, setBookInfo] = useState(null); // 선택된 책 정보
  const [showPopup, setShowPopup] = useState(false); // 팝업 상태

  const categories = [
    { category_id: 1, category_name: '총류' },
    { category_id: 2, category_name: '철학' },
    { category_id: 3, category_name: '종교' },
    { category_id: 4, category_name: '사회과학' },
    { category_id: 5, category_name: '자연과학' },
    { category_id: 6, category_name: '기술과학' },
    { category_id: 7, category_name: '예술' },
    { category_id: 8, category_name: '언어' },
    { category_id: 9, category_name: '문학' },
    { category_id: 10, category_name: '역사' },
    { category_id: 11, category_name: '기타' },
  ];

  useEffect(() => {
    // 서버에서 기존 데이터 가져오기
    const fetchItem = async () => {
      try {
        const response = await getItemDetail(itemId);
        console.log('Item data:', response.data);
        setItem(response.data);
        setBookInfo({
          title: response.data.title,
          author: response.data.author,
          publisher: response.data.publisher,
          price: response.data.price,
          description: response.data.description,
          link: response.data.link,
          image: response.data.image,
        });
      } catch (error) {
        console.error('Error fetching item data:', error);
        alert('상품 정보를 불러오지 못했습니다.');
      }
    };

    fetchItem();
  }, [itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedItem = {
      ...item,
      ...bookInfo,
    };

    try {
      await updateItem(itemId, updatedItem);
      alert('상품이 수정되었습니다!');
    } catch (error) {
      console.error('Error updating item:', error);
      alert('상품 수정 중 오류가 발생했습니다.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>상품 수정</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="itemName">게시물 이름:</label>
          <input
            type="text"
            id="itemName"
            name="itemName"
            value={item.itemName || ''}
            onChange={handleChange}
            placeholder="게시물 이름을 입력하세요"
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="category">카테고리:</label>
          <select
            id="category"
            name="category"
            value={item.category || ''}
            onChange={(e) =>
              handleChange({
                target: {
                  name: 'category',
                  value: parseInt(e.target.value, 10),
                },
              })
            }
            required
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="" disabled>
              카테고리를 선택하세요
            </option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => setShowPopup(true)}
          style={{
            marginBottom: '10px',
            padding: '5px 10px',
            background: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          책 검색
        </button>

        {showPopup && (
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#fff',
              padding: '20px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              zIndex: 1000,
              width: '80%',
              maxHeight: '80%',
              overflowY: 'auto',
              borderRadius: '8px',
            }}
          >
            <BookSearch
              setBookInfo={(info) => {
                setBookInfo(info);
                setShowPopup(false); // 팝업 닫기
              }}
            />
            <button
              onClick={() => setShowPopup(false)}
              style={{
                marginTop: '10px',
                padding: '5px 10px',
                background: '#d9534f',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
              }}
            >
              닫기
            </button>
          </div>
        )}

        {bookInfo && (
          <div
            style={{
              marginBottom: '10px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              background: '#f9f9f9',
            }}
          >
            <h4>선택된 책 정보</h4>
            <p>
              <strong>책 이름:</strong> {bookInfo.title || '없음'}
            </p>
            <p>
              <strong>저자:</strong> {bookInfo.author || '없음'}
            </p>
            <p>
              <strong>출판사:</strong> {bookInfo.publisher || '없음'}
            </p>
            <p>
              <strong>가격:</strong> {bookInfo.price || '없음'}
            </p>
            <p>
              <strong>설명:</strong> {bookInfo.description || '없음'}
            </p>
            <p>
              <strong>링크:</strong>{' '}
              {bookInfo.link ? (
                <a
                  href={bookInfo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  책 링크
                </a>
              ) : (
                '없음'
              )}
            </p>
            {bookInfo.image && (
              <img
                src={bookInfo.image}
                alt="책 이미지"
                style={{ width: '100px', height: 'auto' }}
              />
            )}
          </div>
        )}

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="myPrice">가격:</label>
          <input
            type="number"
            id="myPrice"
            name="myPrice"
            value={item.myPrice || ''}
            onChange={handleChange}
            placeholder="가격을 입력하세요"
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="note">메모:</label>
          <textarea
            id="note"
            name="note"
            value={item.note || ''}
            onChange={handleChange}
            placeholder="상품에 대한 메모를 입력하세요"
            style={{ width: '100%', padding: '8px' }}
          ></textarea>
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            background: '#28a745',
            color: '#fff',
            border: 'none',
          }}
        >
          수정하기
        </button>
      </form>
    </div>
  );
};

export default ItemUpdatePage;
