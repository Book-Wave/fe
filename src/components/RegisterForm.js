import { useState } from "react";
import {
  sendEmail,
  verifyCode,
  register,
  checkNicknameDuplicate,
} from "../services/AuthService";

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
    setNicknameError(""); // 입력 변경 시 오류 메시지 초기화
    setIsNicknameAvailable(false); // 중복 여부 초기화
  };

  // 닉네임 중복 확인 처리
  const handleNicknameCheck = async () => {
    try {
      const isDuplicate = await checkNicknameDuplicate(nickname);
      if (!isDuplicate) {
        setNicknameError("이 닉네임은 이미 사용 중입니다.");
        setIsNicknameAvailable(false);
      } else {
        setNicknameError("사용가능한 닉네임입니다."); // 중복이 없으면 오류 메시지 제거
        setIsNicknameAvailable(true); // 사용 가능한 닉네임으로 표시
      }
    } catch (error) {
      console.error("닉네임 중복 체크 실패:", error);
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
    <div>
      <h2>회원가입</h2>

      {/* 이메일 입력 */}
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleEmailVerification}>이메일 인증 요청</button>
      {emailError && <p>{emailError}</p>}

      {/* 이메일 인증 코드 입력 */}
      <input
        type="text"
        placeholder="인증 코드를 입력하세요"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
      />
      <button onClick={handleVerification}>인증 코드 확인</button>
      {verificationError && <p>{verificationError}</p>}

      {/* 비밀번호 입력 */}
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* 비밀번호 확인 */}
      <input
        type="password"
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {passwordError && <p>{passwordError}</p>}

      {/* 이름 입력 */}
      <input
        type="text"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* 닉네임 입력 */}
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

      {/* 생년월일 입력 */}
      <input
        type="date"
        placeholder="생년월일"
        value={birthdate}
        onChange={(e) => setBirthdate(e.target.value)}
      />

      {/* 성별 선택 */}
      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="0">여성</option>
        <option value="1">남성</option>
      </select>

      {/* 회원가입 버튼 */}
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
    </div>
  );
};

export default Register;
