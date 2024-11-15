import React, {useState} from "react";
import "./InputField.css";

interface InputFieldProps {
    label?: string; // 입력 필드의 라벨
    type?: "text" | "password"; // 입력 필드 타입
    placeholder?: string; // 플레이스홀더 텍스트
    value: string; // 현재 입력값
    onChange: (value: string) => void; // 입력값 변경 이벤트 핸들러
    error?: string; // 에러 메시지
    disabled?: boolean; // 입력 필드 비활성화 여부
    required?: boolean; // 필수 입력 표시
    showTogglePassword?: boolean; // 비밀번호 보기 토글
}

const InputField: React.FC<InputFieldProps> = ({
                                                   label,
                                                   type = "text",
                                                   placeholder = "",
                                                   value,
                                                   onChange,
                                                   error,
                                                   disabled = false,
                                                   required = false,
                                                   showTogglePassword = false,
                                               }) => {
    const [inputType, setInputType] = useState(type);

    const togglePasswordVisibility = () => {
        setInputType(inputType === "password" ? "text" : "password");
    };

    return (
        <div className={`input-field ${disabled ? "disabled" : ""}`}>
            {label && (
                <label className="input-label">
                    {label}
                    {required && <span className="required">*</span>}
                </label>
            )}
            <div className="input-wrapper">
                <input
                    type={inputType}
                    className={`input ${error ? "error" : ""}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                />
                {showTogglePassword && type === "password" && (
                    <button
                        type="button"
                        className="toggle-password"
                        onClick={togglePasswordVisibility}
                    >
                        {inputType === "password" ? "️🙈" : "👁"}
                    </button>
                )}
            </div>
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default InputField;