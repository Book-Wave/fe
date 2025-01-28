import React, { useState, useEffect } from "react";
import { registerItem } from "../services/ItemService";
import { fetchNickName } from "../services/ChatService";
import BookSearch from "../components/BookSearch";

const ItemRegisterPage = () => {
  const categories = [
    { category_id: 1, category_name: "총류" },
    { category_id: 2, category_name: "철학" },
    { category_id: 3, category_name: "종교" },
    { category_id: 4, category_name: "사회과학" },
    { category_id: 5, category_name: "자연과학" },
    { category_id: 6, category_name: "기술과학" },
    { category_id: 7, category_name: "예술" },
    { category_id: 8, category_name: "언어" },
    { category_id: 9, category_name: "문학" },
    { category_id: 10, category_name: "역사" },
    { category_id: 11, category_name: "기타" },
  ];

  const [itemName, setItemName] = useState("");
  const [myPrice, setMyPrice] = useState("");
  const [note, setNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({});
  const [bookInfo, setBookInfo] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [sellerId, setSellerId] = useState(""); // 닉네임 저장

  // 닉네임 가져오기
  useEffect(() => {
    const fetchSellerNickname = async () => {
      try {
        const nickname = await fetchNickName();
        setSellerId(nickname); // 닉네임 저장
      } catch (error) {
        console.error("닉네임 불러오기 실패:", error);
      }
    };

    fetchSellerNickname();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      itemName,
      category: selectedCategory.category_id,
      categoryName: selectedCategory.category_name,
      sellerId, // 가져온 닉네임을 sellerId로 저장
      myPrice: parseInt(myPrice, 10),
      note,
      title: bookInfo?.title || null,
      author: bookInfo?.author || null,
      publisher: bookInfo?.publisher || null,
      price: bookInfo?.price || null,
      description: bookInfo?.description || null,
      link: bookInfo?.link || null,
      image: bookInfo?.image || null,
    };

    try {
      const response = await registerItem(payload);
      alert("상품이 등록되었습니다!");
      console.log("Response:", response.data);

      // 입력 필드 초기화
      setItemName("");
      setMyPrice("");
      setNote("");
      setSelectedCategory({});
      setBookInfo(null);
    } catch (error) {
      console.error("Error registering item:", error);
      alert("상품 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>상품 등록</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="itemName">게시물 이름:</label>
          <input
            type="text"
            id="itemName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="게시물 이름을 입력하세요"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="category">카테고리:</label>
          <select
            id="category"
            value={selectedCategory.category_id || ""}
            onChange={(e) => {
              const selected = categories.find(
                (cat) => cat.category_id === parseInt(e.target.value, 10)
              );
              setSelectedCategory(selected || {});
            }}
            required
            style={{ width: "100%", padding: "8px" }}
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
            marginBottom: "10px",
            padding: "5px 10px",
            background: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          책 검색
        </button>

        {showPopup && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              padding: "20px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              zIndex: 1000,
              width: "40%",
              maxHeight: "80%",
              overflowY: "auto",
              borderRadius: "8px",
            }}
          >
            <BookSearch
              setBookInfo={(info) => {
                setBookInfo(info);
                setShowPopup(false);
              }}
            />
            <button
              onClick={() => setShowPopup(false)}
              style={{
                marginTop: "10px",
                padding: "5px 10px",
                background: "#d9534f",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
              }}
            >
              닫기
            </button>
          </div>
        )}

        {bookInfo && (
          <div
            style={{
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              background: "#f9f9f9",
            }}
          >
            <h4>선택된 책 정보</h4>
            <p>
              <strong>책 이름:</strong> {bookInfo.title || "없음"}
            </p>
            <p>
              <strong>저자:</strong> {bookInfo.author || "없음"}
            </p>
            <p>
              <strong>출판사:</strong> {bookInfo.publisher || "없음"}
            </p>
            <p>
              <strong>가격:</strong> {bookInfo.price || "없음"}
            </p>
            <p>
              <strong>설명:</strong> {bookInfo.description || "없음"}
            </p>
            <p>
              <strong>링크:</strong>{" "}
              {bookInfo.link ? (
                <a href={bookInfo.link} target="_blank" rel="noopener noreferrer">
                  책 링크
                </a>
              ) : (
                "없음"
              )}
            </p>
            {bookInfo.image && (
              <img
                src={bookInfo.image}
                alt="책 이미지"
                style={{ width: "100px", height: "auto" }}
              />
            )}
          </div>
        )}

        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="myPrice">가격:</label>
          <input
            type="number"
            id="myPrice"
            value={myPrice}
            onChange={(e) => setMyPrice(e.target.value)}
            placeholder="가격을 입력하세요"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="note">메모:</label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="상품에 대한 메모를 입력하세요"
            style={{ width: "100%", padding: "8px" }}
          ></textarea>
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#007BFF",
            color: "#fff",
            border: "none",
          }}
        >
          등록하기
        </button>
      </form>
    </div>
  );
};

export default ItemRegisterPage;


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // useNavigate 추가
// import { registerItem } from "../services/ItemService";
// import { fetchNickName } from "../services/ChatService";
// import BookSearch from "../components/BookSearch";

// const ItemRegisterPage = () => {
//   const navigate = useNavigate(); // navigate 훅 사용
//   const categories = [
//     { category_id: 1, category_name: "총류" },
//     { category_id: 2, category_name: "철학" },
//     { category_id: 3, category_name: "종교" },
//     { category_id: 4, category_name: "사회과학" },
//     { category_id: 5, category_name: "자연과학" },
//     { category_id: 6, category_name: "기술과학" },
//     { category_id: 7, category_name: "예술" },
//     { category_id: 8, category_name: "언어" },
//     { category_id: 9, category_name: "문학" },
//     { category_id: 10, category_name: "역사" },
//     { category_id: 11, category_name: "기타" },
//   ];

//   const [itemName, setItemName] = useState("");
//   const [myPrice, setMyPrice] = useState("");
//   const [note, setNote] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState({});
//   const [bookInfo, setBookInfo] = useState(null);
//   const [showPopup, setShowPopup] = useState(false);
//   const [sellerId, setSellerId] = useState("");

//   // 닉네임 가져오기
//   useEffect(() => {
//     const fetchSellerNickname = async () => {
//       try {
//         const nickname = await fetchNickName();
//         setSellerId(nickname);
//       } catch (error) {
//         console.error("닉네임 불러오기 실패:", error);
//       }
//     };

//     fetchSellerNickname();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     const payload = {
//       itemName,
//       category: selectedCategory.category_id,
//       categoryName: selectedCategory.category_name,
//       sellerId,
//       myPrice: parseInt(myPrice, 10),
//       note,
//       title: bookInfo?.title || null,
//       author: bookInfo?.author || null,
//       publisher: bookInfo?.publisher || null,
//       price: bookInfo?.price || null,
//       description: bookInfo?.description || null,
//       link: bookInfo?.link || null,
//       image: bookInfo?.image || null,
//     };
  
//     try {
//       const response = await registerItem(payload); // 서버에 상품 등록 요청
//       console.log("서버 응답:", response.data); // 응답 로그 확인
  
//       const createdItemId = response.data.id; // 서버에서 반환한 item_id
//       if (!createdItemId) {
//         throw new Error("상품 ID가 없습니다. 서버 응답을 확인하세요.");
//       }
  
//       // 상품 등록 성공 시 상세 페이지로 이동
//       alert("상품이 등록되었습니다!");
//       navigate(`/items/${createdItemId}`); // 서버에서 받은 ID로 이동
//     } catch (error) {
//       console.error("상품 등록 중 오류:", error);  
//       alert("상품 등록 중 오류가 발생했습니다.");
//     }
//   };
//   return (
//     <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
//       <h1>상품 등록</h1>
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: "10px" }}>
//           <label htmlFor="itemName">게시물 이름:</label>
//           <input
//             type="text"
//             id="itemName"
//             value={itemName}
//             onChange={(e) => setItemName(e.target.value)}
//             placeholder="게시물 이름을 입력하세요"
//             required
//             style={{ width: "100%", padding: "8px" }}
//           />
//         </div>

//         <div style={{ marginBottom: "10px" }}>
//           <label htmlFor="category">카테고리:</label>
//           <select
//             id="category"
//             value={selectedCategory.category_id || ""}
//             onChange={(e) => {
//               const selected = categories.find(
//                 (cat) => cat.category_id === parseInt(e.target.value, 10)
//               );
//               setSelectedCategory(selected || {});
//             }}
//             required
//             style={{ width: "100%", padding: "8px" }}
//           >
//             <option value="" disabled>
//               카테고리를 선택하세요
//             </option>
//             {categories.map((category) => (
//               <option key={category.category_id} value={category.category_id}>
//                 {category.category_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <button
//           type="button"
//           onClick={() => setShowPopup(true)}
//           style={{
//             marginBottom: "10px",
//             padding: "5px 10px",
//             background: "#007BFF",
//             color: "#fff",
//             border: "none",
//             borderRadius: "5px",
//           }}
//         >
//           책 검색
//         </button>

//         {showPopup && (
//           <div
//             style={{
//               position: "fixed",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)",
//               background: "#fff",
//               padding: "20px",
//               boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//               zIndex: 1000,
//               width: "40%",
//               maxHeight: "80%",
//               overflowY: "auto",
//               borderRadius: "8px",
//             }}
//           >
//             <BookSearch
//               setBookInfo={(info) => {
//                 setBookInfo(info);
//                 setShowPopup(false);
//               }}
//             />
//             <button
//               onClick={() => setShowPopup(false)}
//               style={{
//                 marginTop: "10px",
//                 padding: "5px 10px",
//                 background: "#d9534f",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: "5px",
//               }}
//             >
//               닫기
//             </button>
//           </div>
//         )}

//         {bookInfo && (
//           <div
//             style={{
//               marginBottom: "10px",
//               padding: "10px",
//               border: "1px solid #ddd",
//               borderRadius: "5px",
//               background: "#f9f9f9",
//             }}
//           >
//             <h4>선택된 책 정보</h4>
//             <p>
//               <strong>책 이름:</strong> {bookInfo.title || "없음"}
//             </p>
//             <p>
//               <strong>저자:</strong> {bookInfo.author || "없음"}
//             </p>
//             <p>
//               <strong>출판사:</strong> {bookInfo.publisher || "없음"}
//             </p>
//             <p>
//               <strong>가격:</strong> {bookInfo.price || "없음"}
//             </p>
//             <p>
//               <strong>설명:</strong> {bookInfo.description || "없음"}
//             </p>
//             <p>
//               <strong>링크:</strong>{" "}
//               {bookInfo.link ? (
//                 <a href={bookInfo.link} target="_blank" rel="noopener noreferrer">
//                   책 링크
//                 </a>
//               ) : (
//                 "없음"
//               )}
//             </p>
//             {bookInfo.image && (
//               <img
//                 src={bookInfo.image}
//                 alt="책 이미지"
//                 style={{ width: "100px", height: "auto" }}
//               />
//             )}
//           </div>
//         )}

//         <div style={{ marginBottom: "10px" }}>
//           <label htmlFor="myPrice">가격:</label>
//           <input
//             type="number"
//             id="myPrice"
//             value={myPrice}
//             onChange={(e) => setMyPrice(e.target.value)}
//             placeholder="가격을 입력하세요"
//             required
//             style={{ width: "100%", padding: "8px" }}
//           />
//         </div>

//         <div style={{ marginBottom: "10px" }}>
//           <label htmlFor="note">메모:</label>
//           <textarea
//             id="note"
//             value={note}
//             onChange={(e) => setNote(e.target.value)}
//             placeholder="상품에 대한 메모를 입력하세요"
//             style={{ width: "100%", padding: "8px" }}
//           ></textarea>
//         </div>

//         <button
//           type="submit"
//           style={{
//             padding: "10px 20px",
//             background: "#007BFF",
//             color: "#fff",
//             border: "none",
//           }}
//         >
//           등록하기
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ItemRegisterPage;
