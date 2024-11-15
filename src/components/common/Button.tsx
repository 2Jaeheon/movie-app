import React from "react";
import "./Button.css";

interface ButtonProps {
    label: string; // 버튼에 표시할 텍스트
    onClick?: () => void; // 클릭 이벤트 핸들러
    type?: "button" | "submit" | "reset"; // 버튼 타입
    variant?: "primary" | "secondary" | "tertiary"; // 버튼 스타일
    size?: "small" | "medium" | "large"; // 버튼 크기
    disabled?: boolean; // 버튼 비활성화 여부
}

const Button: React.FC<ButtonProps> = ({
                                           label,
                                           onClick,
                                           type = "button",
                                           variant = "primary",
                                           size = "medium",
                                           disabled = false,
                                       }) => {
    return (
        <button
            className={`button ${variant} ${size} ${disabled ? "disabled" : ""}`}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            {label}
        </button>
    );
};

export default Button;