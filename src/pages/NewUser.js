import React from "react";
import NewUserForm from "../components/NewUserForm";

const NewUserPage = () => {
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>추가 정보 입력</h1>
      <NewUserForm />
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    padding: "20px",
    backgroundColor: "#f9f9f9",
  },
  title: {
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
  },
};

export default NewUserPage;
