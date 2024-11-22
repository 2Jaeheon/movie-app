import {useState, useEffect} from "react";

// 무한 스크롤을 처리하는 커스텀 훅
export const useInfiniteScroll = (fetchMore: () => Promise<void>) => {
    const [isFetching, setIsFetching] = useState(false); // 데이터를 더 불러오는 상태 관리

    useEffect(() => {
        // 스크롤 이벤트 핸들러
        const handleScroll = () => {
            // 문서의 끝에서 500px 이내에 도달하고, 현재 데이터가 로딩 중이지 않으면
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 500 &&
                !isFetching
            ) {
                setIsFetching(true); // 데이터를 더 불러오도록 상태 변경
            }
        };

        // 스크롤 이벤트 리스너 추가
        window.addEventListener("scroll", handleScroll);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isFetching]); // isFetching 상태에 따라 effect가 재실행되도록 설정

    useEffect(() => {
        // isFetching이 true일 때 데이터를 더 불러오기
        if (!isFetching) return; // 이미 데이터를 불러오고 있으면 리턴

        // 데이터를 불러오는 함수 실행
        fetchMore().finally(() => setIsFetching(false)); // 데이터 불러온 후 isFetching을 false로 설정
    }, [isFetching, fetchMore]); // isFetching과 fetchMore 함수가 변경될 때마다 실행

    return {isFetching, setIsFetching}; // 데이터를 불러오는 상태와 상태 변경 함수 반환
};