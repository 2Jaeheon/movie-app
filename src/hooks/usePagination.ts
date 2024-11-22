import {useState} from "react";

// 페이지네이션 상태를 관리하는 커스텀 훅
export const usePagination = () => {
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태, 기본값 1
    const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수 상태, 기본값 1

    // 다음 페이지로 이동
    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    // 이전 페이지로 이동
    const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    // 특정 페이지로 이동
    const setPage = (page: number) => setCurrentPage(page);

    return {
        currentPage, // 현재 페이지
        totalPages, // 전체 페이지 수
        setTotalPages, // 전체 페이지 수 설정 함수
        goToNextPage, // 다음 페이지로 이동하는 함수
        goToPrevPage, // 이전 페이지로 이동하는 함수
        setPage, // 특정 페이지로 이동하는 함수
    };
};