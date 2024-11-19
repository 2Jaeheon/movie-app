import React from "react";
import "./ErrorComponent.css";

interface ErrorComponentProps {
    errorMessage: string;
    onRetry: () => void;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({
                                                           errorMessage,
                                                           onRetry,
                                                       }) => {
    return (
        <div className="error-view">
            <h1 className="error-title">🚨 에러 발생!</h1>
            <p className="error-message">{errorMessage}</p>
            <p className="error-description">
                현재 영화 데이터를 불러올 수 없습니다. <br/>
                API 키를 확인하거나 나중에 다시 시도해주세요.
            </p>
            <button className="retry-button" onClick={onRetry}>
                다시 시도하기
            </button>
        </div>
    );
};

export default ErrorComponent;