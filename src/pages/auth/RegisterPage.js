import React from "react";
import { Route, Routes } from "react-router-dom";
import NewUserForm from "../../components/NewUserForm";
import RegisterForm from "../../components/RegisterForm";

const RegisterPage = () => {
  return (
    <Routes>
      <Route path="/oauth" element={<NewUserForm />} />
      <Route path="/" element={<RegisterForm />} />
    </Routes>
  );
};

export default RegisterPage;
