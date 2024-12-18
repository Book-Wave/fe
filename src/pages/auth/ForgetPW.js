import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendEmail, verifyCode, resetting } from "../../services/AuthService";
import Button from "../../components/common/Button";

const ForgetPW = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState(""); // 새 비밀번호
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 여부
  const [emailError, setEmailError] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [passwordError, setPasswordError] = useState(""); // 비밀번호 오류 메시지
  const [settingError, setSettingError] = useState(""); // 비밀번호 재설정 오류 메시지
  const navigate = useNavigate(); // 페이지 이동

  // 비밀번호 제약조건 검사
  const passwordRequirements =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // 이메일 인증 요청
  const handleEmailVerification = async () => {
    try {
      alert("이메일 인증 코드가 발송되었습니다.");
      await sendEmail(email);
    } catch (error) {
      setEmailError("이메일 인증 요청에 실패했습니다.");
    }
  };

  // 이메일 인증 코드 확인
  const handleVerification = async () => {
    try {
      const response = await verifyCode(email, verificationCode);

      if (response.status === 200) {
        setIsEmailVerified(true);
        alert("이메일 인증이 완료되었습니다.");
      }
    } catch (error) {
      setVerificationError("인증 코드가 잘못되었습니다.");
    }
  };

  // 비밀번호 재설정
  const handleResetting = async (e) => {
    e.preventDefault();

    if (!isEmailVerified) {
      alert("이메일 인증이 완료되지 않았습니다.");
      return;
    }

    // 비밀번호 확인
    if (password !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await resetting(email, password, confirmPassword);
      alert("비밀번호 재설정이 완료되었습니다.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error response:", error.response);
      setSettingError(error.response.data || "비밀번호 재설정에 실패했습니다.");
    }
  };

  // 비밀번호 실시간 검증
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (!passwordRequirements.test(value)) {
      setPasswordError(
        "비밀번호는 최소 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다."
      );
    } else {
      setPasswordError("");
    }
  };

  // 비밀번호 확인 실시간 검증
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value !== password) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordError("");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">비밀번호 재설정</h2>
      <form onSubmit={handleResetting} className="space-y-4">
        {/* 이메일 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            이메일
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="email"
              className="mt-1 block w-full flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-1"
              placeholder="이메일을 입력하세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button
              variant="text"
              className="mt-1"
              size="sm"
              onClick={handleEmailVerification}
              type="button"
            >
              이메일 인증 요청
            </Button>
          </div>
          {emailError && (
            <p className="mt-1 text-sm text-red-600">{emailError}</p>
          )}
        </div>

        {/* 인증 코드 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            인증 코드
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              className="mt-1 block w-full flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-1"
              placeholder="인증 코드를 입력하세요."
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
            <Button
              variant="text"
              className="mt-1"
              size="sm"
              onClick={handleVerification}
              type="button"
            >
              인증 코드 확인
            </Button>
          </div>
          {verificationError && (
            <p className="mt-1 text-sm text-red-600">{verificationError}</p>
          )}
        </div>

        {/* 새 비밀번호 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            새 비밀번호
          </label>
          <input
            type="password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-1"
            placeholder="새 비밀번호를 입력하세요."
            value={password}
            onChange={handlePasswordChange}
            required
          />
          {passwordError && (
            <p className="mt-1 text-sm text-red-600">{passwordError}</p>
          )}
        </div>

        {/* 비밀번호 확인 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            비밀번호 확인
          </label>
          <input
            type="password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-1"
            placeholder="비밀번호를 다시 입력하세요."
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
        </div>
        {settingError && (
          <p className="mt-1 text-sm text-red-600">{settingError}</p>
        )}

        {/* 제출 버튼 */}
        <Button variant="contained" className="mt-4 w-full" type="submit">
          비밀번호 재설정
        </Button>
      </form>
    </div>
  );
};

export default ForgetPW;
