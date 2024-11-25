import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerOAuth, checkNicknameDuplicate } from "../services/AuthService";

const NewUserForm = () => {
  const [formData, setFormData] = useState({
    nickname: "",
    birthdate: "",
    gender: "",
  });

  const [nicknameError, setNicknameError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNicknameCheck = async () => {
    const { nickname } = formData;
    if (!nickname) {
      setNicknameError("닉네임을 입력해주세요.");
      return;
    }

    try {
      const isAvailable = await checkNicknameDuplicate(nickname);
      if (!isAvailable) {
        setNicknameError("이미 사용 중인 닉네임입니다.");
      } else {
        setNicknameError("사용 가능한 닉네임입니다.");
      }
    } catch (error) {
      setNicknameError("닉네임 중복 체크에 실패했습니다.");
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nickname, birthdate, gender } = formData;

    if (nicknameError !== "사용 가능한 닉네임입니다.") {
      alert("닉네임을 확인해주세요.");
      return;
    }

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
      <button type="button" onClick={handleNicknameCheck}>
        닉네임 중복 확인
      </button>
      {nicknameError && <p>{nicknameError}</p>}
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
