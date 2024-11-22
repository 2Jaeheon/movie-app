import {Movie} from "../models/Movie"; // Movie 타입을 임포트

const WISHLIST_KEY = "wishlist"; // 로컬 스토리지에 저장할 키값 정의

// 로컬 스토리지에서 찜 목록을 가져오는 함수
export const getWishlist = (): Movie[] => {
    const storedWishlist = localStorage.getItem(WISHLIST_KEY); // 로컬 스토리지에서 "wishlist" 키에 해당하는 데이터를 가져옴
    return storedWishlist ? JSON.parse(storedWishlist) : []; // 데이터가 있으면 파싱하여 반환, 없으면 빈 배열 반환
};

// 찜 목록에 영화를 추가하는 함수 (중복 제거)
export const addToWishlist = (movie: Movie): void => {
    const currentWishlist = getWishlist(); // 현재 찜 목록을 가져옴
    const isAlreadyInWishlist = currentWishlist.some((m) => m.id === movie.id); // 해당 영화가 이미 찜 목록에 있는지 확인

    if (!isAlreadyInWishlist) {
        // 영화가 없다면 찜 목록에 추가
        const updatedWishlist = [...currentWishlist, movie];
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(updatedWishlist)); // 로컬 스토리지에 업데이트된 목록 저장
    }
};

// 찜 목록에서 영화를 제거하는 함수
export const removeFromWishlist = (movieId: number): void => {
    const currentWishlist = getWishlist(); // 현재 찜 목록을 가져옴
    const updatedWishlist = currentWishlist.filter((movie) => movie.id !== movieId); // 해당 영화 ID와 일치하는 항목을 필터링하여 제거
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updatedWishlist)); // 로컬 스토리지에 업데이트된 목록 저장
};