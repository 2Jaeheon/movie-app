import React, {useEffect} from "react";
import "./Toast.css";

export type ToastType = "success" | "error" | "info" | "warning"; // 토스트 타입 정의

interface ToastProps {
    message: string; // 표시할 메시지
    type?: ToastType; // 토스트 타입 (기본값: "info")
    isVisible: boolean; // 토스트 표시 여부
    onClose: () => void; // 토스트 닫기 이벤트 핸들러
    duration?: number; // 표시 시간 (밀리초 단위, 기본값: 3000ms)
}

const Toast: React.FC<ToastProps> = ({
                                         message,
                                         type = "info", // 기본값 "info"
                                         isVisible,
                                         onClose,
                                         duration = 3000, // 기본값 3000ms (3초)
                                     }) => {
    useEffect(() => {
        if (isVisible) {
            // 토스트가 보일 때만 타이머 설정
            const timer = setTimeout(() => {
                onClose(); // duration이 지나면 onClose 함수 호출
            }, duration);
            return () => clearTimeout(timer); // 컴포넌트가 언마운트 될 때 타이머 정리
        }
    }, [isVisible, duration, onClose]); // isVisible, duration, onClose가 변경될 때마다 effect 실행

    if (!isVisible) return null; // isVisible이 false일 경우 토스트를 렌더링하지 않음

    return (
        <div className={`toast ${type}`}>
            {/* 토스트 타입에 따라 클래스 추가 */}
            <span>{message}</span> {/* 메시지 표시 */}
            <button className="toast-close" onClick={onClose}>
                &times; {/* 닫기 버튼 (X 표시) */}
            </button>
        </div>
    );
};

export default Toast;