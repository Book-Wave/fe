// src/components/Button.js
import React from "react";

// 기본 Button 컴포넌트
const Button = ({
  type = "button",
  children,
  onClick,
  className = "",
  variant = "filled",
  size = "sm",
  disabled = false,
}) => {
  const baseStyles =
    "font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50";
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-md",
    lg: "px-8 py-4 text-lg",
  };
  const variantStyles = {
    filled: "bg-[#0080FF] text-white hover:bg-[#0000FF]",
    outlined:
      "border-2 border-[#0080FF] text-blue-500 hover:bg-[#0000FF] hover:text-white",
    text: "text-[#0080FF] hover:underline",
    gradient:
      "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white hover:opacity-80 focus:ring-blue-500",
  };

  const disabledStyles = disabled ? "cursor-not-allowed opacity-50" : "";

  const buttonClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className} ${disabledStyles}`;
  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClasses}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
