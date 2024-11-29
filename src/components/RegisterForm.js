import { useState } from "react";
import {
  sendEmail,
  verifyCode,
  register,
  checkNicknameDuplicate,
} from "../services/AuthService";
import Button from "./common/Button";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("0"); // 0 -> 여성, 1 -> 남성
  const [verificationCode, setVerificationCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [nicknameError, setNicknameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);

  const handleNicknameChange = (e) => {
    const newNickname = e.target.value;
    setNickname(newNickname);
    setNicknameError("");
    setIsNicknameAvailable(false);
  };

  // 닉네임 중복 확인 처리
  const handleNicknameCheck = async () => {
    try {
      const isDuplicate = await checkNicknameDuplicate(nickname);
      if (!isDuplicate) {
        setNicknameError("이 닉네임은 이미 사용 중입니다.");
        setIsNicknameAvailable(false);
      } else {
        setNicknameError("사용가능한 닉네임입니다.");
        setIsNicknameAvailable(true);
      }
    } catch (error) {
      setNicknameError("닉네임 중복 체크에 실패했습니다.");
    }
  };

  // 이메일 인증 요청
  const handleEmailVerification = async () => {
    try {
      const response = await sendEmail(email);
      console.log(response);
      alert("이메일 인증 코드가 발송되었습니다.");
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

  // 회원가입 처리
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!isEmailVerified) {
      alert("이메일 인증이 완료되지 않았습니다.");
      return;
    }

    if (!isNicknameAvailable) {
      alert("닉네임이 중복되었습니다. 다른 닉네임을 선택해주세요.");
      return;
    }

    try {
      const response = await register(
        email,
        password,
        name,
        nickname,
        birthdate,
        gender
      );
      console.log(response);
      alert("회원가입이 완료되었습니다.");
      navigator("/dashboard");
    } catch (error) {
      setRegistrationError("회원가입 실패");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">회원가입</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            이메일
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="email"
              className="mt-1 block w-full flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-1"
              placeholder="  이메일을 입력하세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              variant="text"
              className="mt-1"
              size="sm"
              onClick={handleEmailVerification}
            >
              이메일 인증 요청
            </Button>
            {emailError && (
              <p className="mt-1 text-sm text-red-600">{emailError}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            인증 코드
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              className="mt-1 block w-full flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-1"
              placeholder="  인증 코드를 입력하세요."
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <Button
              variant="text"
              className="mt-1"
              size="sm"
              onClick={handleVerification}
            >
              인증 코드 확인
            </Button>
          </div>
          {verificationError && (
            <p className="mt-1 text-sm text-red-600">{verificationError}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            비밀번호
          </label>
          <div className="flex flex-col">
            <input
              type="password"
              className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-1"
              placeholder="  비밀번호를 입력하세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-1"
              placeholder="  비밀번호를 한번 더 입력하세요."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {passwordError && (
              <p className="mt-1 text-sm text-red-600">{passwordError}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            이름
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-1"
            placeholder="  이름을 입력하세요."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            닉네임
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              className="mt-1 block w-full flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-1"
              placeholder="  닉네임을 입력하세요."
              value={nickname}
              onChange={handleNicknameChange}
            />
            <Button
              variant="text"
              className="mt-1"
              size="sm"
              onClick={handleNicknameCheck}
            >
              닉네임 중복 체크
            </Button>
            {nicknameError && (
              <p className="mt-1 text-sm text-red-600">{nicknameError}</p>
            )}
          </div>
        </div>
        <div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              생년월일
            </label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-1"
              placeholder="생년월일"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            성별
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-1"
          >
            <option value="0">여성</option>
            <option value="1">남성</option>
          </select>
        </div>
      </form>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button
          type="submit"
          onClick={handleRegister}
          className="w-full"
          disabled={
            !isEmailVerified ||
            !isNicknameAvailable ||
            passwordError ||
            password !== confirmPassword
          }
        >
          회원가입
        </Button>
        {registrationError && (
          <p className="mt-1 text-sm text-red-600">{registrationError}</p>
        )}
      </div>
    </div>

    /* <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleEmailVerification}>이메일 인증 요청</button>
      {emailError && <p>{emailError}</p>}

      <input
        type="text"
        placeholder="인증 코드를 입력하세요"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
      />
      <button onClick={handleVerification}>인증 코드 확인</button>
      {verificationError && <p>{verificationError}</p>}

      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {passwordError && <p>{passwordError}</p>}

      <input
        type="text"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="닉네임"
        value={nickname}
        onChange={handleNicknameChange}
      />
      <button type="button" onClick={handleNicknameCheck}>
        닉네임 중복 확인
      </button>
      {nicknameError && <p>{nicknameError}</p>}

      <input
        type="date"
        placeholder="생년월일"
        value={birthdate}
        onChange={(e) => setBirthdate(e.target.value)}
      />

      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="0">여성</option>
        <option value="1">남성</option>
      </select>

      <button
        onClick={handleRegister}
        disabled={
          !isEmailVerified ||
          !isNicknameAvailable ||
          passwordError ||
          password !== confirmPassword
        }
      >
        회원가입
      </button>
      {registrationError && <p>{registrationError}</p>}
    </div> */
  );
};

export default Register;
