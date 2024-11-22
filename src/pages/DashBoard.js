// ./src/pages/DashboardPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import { whoami } from "../services/AuthService";

// const api = "http://localhost:8080/book";

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }
    const fetchUserData = async () => {
      console.log(token);
      try {
        const response = await whoami(token);
        console.log(response);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        setError("유저 정보를 불러오는데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div>
      <h2>대시보드</h2>
      {user && (
        <div>
          <h3>환영합니다, {user.name}님!</h3>
          <p>Email: {user.email}</p>
          <p>Hertz: {user.hertz}</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
