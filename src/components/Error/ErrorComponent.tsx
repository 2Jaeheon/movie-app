import React from "react";
import "./ErrorComponent.css";

interface ErrorComponentProps {
    errorMessage: string; // 표시할 에러 메시지
    onRetry: () => void; // 다시 시도하는 함수
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({
                                                           errorMessage,
                                                           onRetry,
                                                       }) => {
    return (
        <div className="error-view">
            <h1 className="error-title">🚨 에러 발생!</h1>
            {/* 에러 발생을 알리는 제목 */}
            <p className="error-message">{errorMessage}</p>
            {/* 전달된 에러 메시지 표시 */}
            <p className="error-description">
                현재 영화 데이터를 불러올 수 없습니다. <br/>
                API 키를 확인하거나 나중에 다시 시도해주세요.
            </p>
            {/* 에러 설명 텍스트 */}
            <button className="retry-button" onClick={onRetry}>
                다시 시도하기
            </button>
            {/* 버튼 클릭 시 onRetry 함수 호출 */}
        </div>
    );
};

export default ErrorComponent;