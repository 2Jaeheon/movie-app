import React from "react";
import "./InputField.css";

interface InputFieldProps {
    label?: string; // 필드 라벨
    type?: "text" | "password"; // 입력 필드 타입
    placeholder?: string; // 플레이스홀더
    value: string; // 현재 입력값
    onChange: (value: string) => void; // 입력값 변경 핸들러
    error?: string; // 에러 메시지
    disabled?: boolean; // 비활성화 여부
}

const InputField: React.FC<InputFieldProps> = ({
                                                   label,
                                                   type = "text",
                                                   placeholder = "",
                                                   value,
                                                   onChange,
                                                   error,
                                                   disabled = false,
                                               }) => {
    return (
        <div className={`input-field ${error ? "error" : ""}`}>
            {label && <label className="input-label">{label}</label>}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="input"
            />
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default InputField;