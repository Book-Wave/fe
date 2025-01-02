import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerOAuth, checkNicknameDuplicate } from "../services/AuthService";
import Button from "./common/Button";

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
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to save user info:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">추가 정보 입력</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            닉네임
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              name="nickname"
              className="mt-1 block w-full flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-1"
              placeholder="닉네임을 입력하세요"
              value={formData.nickname}
              onChange={handleChange}
            />
            <Button variant="text" size="sm" onClick={handleNicknameCheck}>
              닉네임 중복 체크
            </Button>
            {nicknameError && (
              <p className="mt-1 text-sm text-red-600">{nicknameError}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            생년월일
          </label>
          <input
            type="date"
            name="birthdate"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-1"
            value={formData.birthdate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            성별
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-1"
          >
            <option value="">성별 선택</option>
            <option value="1">남성</option>
            <option value="0">여성</option>
          </select>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button
            type="submit"
            className="w-full"
            disabled={nicknameError !== "사용 가능한 닉네임입니다."}
          >
            회원가입
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewUserForm;
