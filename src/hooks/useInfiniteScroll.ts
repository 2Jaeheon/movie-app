import {useState, useEffect} from "react";

export const useInfiniteScroll = (fetchMore: () => Promise<void>) => {
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // 스크롤이 하단에 도달했는지 확인
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 500 &&
                !isFetching
            ) {
                setIsFetching(true);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isFetching]);

    useEffect(() => {
        if (!isFetching) return;
        fetchMore().finally(() => setIsFetching(false));
    }, [isFetching, fetchMore]);

    return {isFetching, setIsFetching};
};