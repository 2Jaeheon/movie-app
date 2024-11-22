import React from "react";
import "./InputField.css";

interface InputFieldProps {
    label?: string; // 필드 라벨 (선택사항)
    type?: "text" | "password"; // 입력 필드 타입 (기본값: "text")
    placeholder?: string; // 플레이스홀더 (입력 필드에 표시되는 기본 텍스트)
    value: string; // 현재 입력값
    onChange: (value: string) => void; // 입력값 변경 핸들러
    error?: string; // 에러 메시지 (선택사항)
    disabled?: boolean; // 비활성화 여부 (기본값: false)
}

const InputField: React.FC<InputFieldProps> = ({
                                                   label,
                                                   type = "text", // 기본값 "text"
                                                   placeholder = "", // 기본값 빈 문자열
                                                   value,
                                                   onChange,
                                                   error,
                                                   disabled = false, // 기본값 false
                                               }) => {
    return (
        <div className={`input-field ${error ? "error" : ""}`}>
            {/* 에러가 있을 경우 'error' 클래스를 추가하여 스타일 변경 */}
            {label && <label className="input-label">{label}</label>}
            {/* label이 있을 경우에만 라벨을 표시 */}
            <input
                type={type} // 입력 타입 설정 (text 또는 password)
                placeholder={placeholder} // 플레이스홀더 텍스트 설정
                value={value} // 현재 입력값을 설정
                onChange={(e) => onChange(e.target.value)} // 값 변경 시 onChange 핸들러 호출
                disabled={disabled} // 비활성화 여부 설정
                className="input" // 기본 입력 필드 스타일 적용
            />
            {error && <span className="error-message">{error}</span>}
            {/* 에러가 있을 경우 에러 메시지를 표시 */}
        </div>
    );
};

export default InputField;