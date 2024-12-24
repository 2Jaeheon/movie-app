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
    const handleRetry = () => {
        // localStorage에서 accessToken 제거
        localStorage.removeItem("accessToken");

        // 페이지 새로고침
        window.location.reload();
    };

    return (
        <div className="error-view">
            <h1 className="error-title">🚨 에러 발생!</h1>
            <p className="error-message">{errorMessage}</p>
            <p className="error-description">
                현재 영화 데이터를 불러올 수 없습니다. <br/>
                회원 정보 확인 및 API의 상태를 확인해주세요. <br/>
                <br/>
                계속해서 문제 발생 시 로그아웃 후 다시 로그인해주세요.
            </p>
            <button className="retry-button" onClick={handleRetry}>
                다시 시도하기
            </button>
        </div>
    );
};

export default ErrorComponent;