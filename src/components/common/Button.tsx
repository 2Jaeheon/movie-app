import React from "react";
import "./Button.css";

interface ButtonProps {
    label: string; // 버튼에 표시할 텍스트
    onClick?: () => void; // 클릭 이벤트 핸들러
    type?: "button" | "submit" | "reset"; // 버튼 타입 (기본값: "button")
    variant?: "primary" | "secondary" | "tertiary"; // 버튼 스타일 (기본값: "primary")
    size?: "small" | "medium" | "large"; // 버튼 크기 (기본값: "medium")
    disabled?: boolean; // 버튼 비활성화 여부 (기본값: false)
}

const Button: React.FC<ButtonProps> = ({
                                           label,
                                           onClick,
                                           type = "button", // 기본값 "button"
                                           variant = "primary", // 기본값 "primary"
                                           size = "medium", // 기본값 "medium"
                                           disabled = false, // 기본값 false
                                       }) => {
    return (
        <button
            className={`button ${variant} ${size} ${disabled ? "disabled" : ""}`} // 클래스 이름에 스타일과 크기, 비활성화 상태 추가
            onClick={onClick} // 클릭 시 이벤트 핸들러 실행
            type={type} // 버튼의 타입 설정
            disabled={disabled} // 비활성화 상태 설정
        >
            {label} // 버튼 텍스트 표시
        </button>
    );
};

export default Button;