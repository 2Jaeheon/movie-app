import React from "react";
import "./Modal.css";

interface ModalProps {
    isOpen: boolean; // 모달 표시 여부
    onClose: () => void; // 닫기 이벤트 핸들러
    children: React.ReactNode; // 모달 내용
    size?: "small" | "medium" | "large"; // 모달 크기
    title?: string; // 모달 제목 (선택적)
}

const Modal: React.FC<ModalProps> = ({
                                         isOpen,
                                         onClose,
                                         children,
                                         size = "medium",
                                         title,
                                     }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className={`modal-content ${size}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    {title && <h2 className="modal-title">{title}</h2>}
                    <button className="modal-close" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
};

export default Modal;