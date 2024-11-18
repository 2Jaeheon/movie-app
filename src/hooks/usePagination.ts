import {useState} from "react";

export const usePagination = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const setPage = (page: number) => setCurrentPage(page);

    return {
        currentPage,
        totalPages,
        setTotalPages,
        goToNextPage,
        goToPrevPage,
        setPage,
    };
};