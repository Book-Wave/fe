import React from "react";
import { Route, Routes } from "react-router-dom";
import NewUserForm from "../../components/auth/NewUserForm";
import RegisterForm from "../../components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <Routes>
      <Route path="/oauth" element={<NewUserForm />} />
      <Route path="/" element={<RegisterForm />} />
    </Routes>
  );
};

export default RegisterPage;
