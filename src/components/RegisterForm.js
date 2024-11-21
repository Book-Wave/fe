import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerOAuth } from "../services/AuthService";

const NewUserForm = () => {
  const [formData, setFormData] = useState({
    nickname: "",
    birthdate: "",
    gender: "",
  });
  const navigate = useNavigate();

  // 입력 값 변경 핸들러
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nickname, birthdate, gender } = formData;

    try {
      // 세션에 저장된 oauth 정보는 서버에서 자동 처리
      const response = await registerOAuth(nickname, birthdate, gender);
      console.log(response);
      // 토큰 저장 후 메인 페이지로 이동
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to save user info:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="nickname"
        placeholder="닉네임"
        value={formData.nickname}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="birthdate"
        value={formData.birthdate}
        onChange={handleChange}
        required
      />
      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        required
      >
        <option value="">성별 선택</option>
        <option value="1">남성</option>
        <option value="0">여성</option>
      </select>
      <button type="submit">저장하기</button>
    </form>
  );
};

export default NewUserForm;
