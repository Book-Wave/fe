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
      const response = await registerOAuth(nickname, birthdate, gender);
      console.log(response);

      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("refresh_token", response.refresh_token);
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
