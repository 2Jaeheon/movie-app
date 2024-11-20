import React, {useEffect} from "react";
import "./Toast.css";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
    message: string; // 표시할 메시지
    type?: ToastType; // 토스트 타입
    isVisible: boolean; // 토스트 표시 여부
    onClose: () => void; // 닫기 이벤트 핸들러
    duration?: number; // 표시 시간 (밀리초, 기본값 3초)
}

const Toast: React.FC<ToastProps> = ({
                                         message,
                                         type = "info",
                                         isVisible,
                                         onClose,
                                         duration = 3000,
                                     }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer); // 언마운트 시 타이머 정리
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    return (
        <div className={`toast ${type}`}>
            <span>{message}</span>
            <button className="toast-close" onClick={onClose}>
                &times;
            </button>
        </div>
    );
};

export default Toast;