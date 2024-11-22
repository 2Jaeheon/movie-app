import {useState, useEffect} from "react";
import {fetchWishlist, addMovieToWishlist, removeMovieFromWishlist} from "../controllers/userPreferenceController"; // 사용자 선호도 관련 함수 임포트
import {Movie} from "../models/Movie"; // Movie 타입 임포트

// 사용자 선호도(위시리스트) 관리하는 커스텀 훅
export const usePreference = () => {
    const [wishlist, setWishlist] = useState<Movie[]>([]); // 위시리스트 상태 (영화 배열)

    // 컴포넌트가 마운트될 때 위시리스트 데이터를 불러오는 useEffect
    useEffect(() => {
        const initialWishlist = fetchWishlist(); // 초기 위시리스트 불러오기
        setWishlist(initialWishlist); // 상태에 위시리스트 저장
    }, []); // 컴포넌트가 처음 마운트될 때만 실행

    // 영화 추가 함수
    const addToWishlist = (movie: Movie) => {
        // 이미 위시리스트에 없는 영화만 추가
        if (!wishlist.some((m) => m.id === movie.id)) {
            addMovieToWishlist(movie); // 영화 위시리스트에 추가
            setWishlist(fetchWishlist()); // 상태 업데이트 (위시리스트 재조회)
        }
    };

    // 영화 제거 함수
    const removeFromWishlist = (movieId: number) => {
        removeMovieFromWishlist(movieId); // 영화 위시리스트에서 제거
        setWishlist(fetchWishlist()); // 상태 업데이트 (위시리스트 재조회)
    };

    // 반환 값: 위시리스트 상태와 영화 추가/제거 함수
    return {wishlist, addToWishlist, removeFromWishlist};
};