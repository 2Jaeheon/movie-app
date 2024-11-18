import React from "react";
import "./Pagination.css";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onNext: () => void;
    onPrev: () => void;
}

const Pagination: React.FC<PaginationProps> = ({currentPage, totalPages, onNext, onPrev}) => {
    // 부드럽게 페이지 상단으로 스크롤 함수
    const scrollToTop = () => {
        window.scrollTo({
            top: 0, // 페이지의 최상단으로 이동
            behavior: "smooth", // 부드럽게 스크롤 이동
        });
    };

    const handleNext = () => {
        scrollToTop(); // 상단으로 이동
        onNext(); // 다음 페이지 로드
    };

    const handlePrev = () => {
        scrollToTop(); // 상단으로 이동
        onPrev(); // 이전 페이지 로드
    };

    return (
        <div className="pagination">
            <button
                className="pagination-button"
                onClick={handlePrev}
                disabled={currentPage === 1}
            >
                이전
            </button>
            <span className="pagination-info">
                {currentPage} / {totalPages}
            </span>
            <button
                className="pagination-button"
                onClick={handleNext}
                disabled={currentPage === totalPages}
            >
                다음
            </button>
        </div>
    );
};

export default Pagination;