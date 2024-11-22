import React from "react";
import "./Modal.css";

interface ModalProps {
    isOpen: boolean; // 모달이 열려 있는지 여부
    onClose: () => void; // 모달을 닫는 함수
    children: React.ReactNode; // 모달 내용 (자식 요소)
    title?: string; // 모달 제목 (선택사항)
}

const Modal: React.FC<ModalProps> = ({isOpen, onClose, children, title}) => {
    if (!isOpen) return null; // 모달이 열려 있지 않으면 렌더링하지 않음

    return (
        <div className="modal-overlay" onClick={onClose}>
            {/* 모달 배경 클릭 시 모달 닫기 */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* 모달 내용 클릭 시 배경으로 이벤트 전파 방지 */}
                <div className="modal-header">
                    {title && <h2 className="modal-title">{title}</h2>}
                    {/* 제목이 있으면 제목 표시 */}
                    <button className="modal-close" onClick={onClose}>
                        &times; {/* 닫기 버튼 (X 표시) */}
                    </button>
                </div>
                <div className="modal-body">{children}</div>
                {/* 모달의 실제 내용 */}
            </div>
        </div>
    );
};

export default Modal;