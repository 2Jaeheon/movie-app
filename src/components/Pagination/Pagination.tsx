import React from "react";
import "./Pagination.css";

interface PaginationProps {
    currentPage: number; // 현재 페이지 번호
    totalPages: number; // 전체 페이지 수
    onNext: () => void; // 다음 페이지로 이동하는 함수
    onPrev: () => void; // 이전 페이지로 이동하는 함수
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
            {/* 이전 페이지 버튼 */}
            <button
                className="pagination-button"
                onClick={handlePrev}
                disabled={currentPage === 1} // 현재 페이지가 1이면 비활성화
            >
                이전
            </button>
            {/* 현재 페이지 / 전체 페이지 정보 표시 */}
            <span className="pagination-info">
                {currentPage} / {totalPages}
            </span>
            {/* 다음 페이지 버튼 */}
            <button
                className="pagination-button"
                onClick={handleNext}
                disabled={currentPage === totalPages} // 현재 페이지가 마지막 페이지이면 비활성화
            >
                다음
            </button>
        </div>
    );
};

export default Pagination;