import {Movie} from "../models/Movie";

const WISHLIST_KEY = "wishlist";

// 로컬 스토리지에서 찜 목록 가져오기
export const getWishlist = (): Movie[] => {
    const storedWishlist = localStorage.getItem(WISHLIST_KEY);
    return storedWishlist ? JSON.parse(storedWishlist) : [];
};

// 찜 목록에 영화 추가 (중복 제거)
export const addToWishlist = (movie: Movie): void => {
    const currentWishlist = getWishlist();
    const isAlreadyInWishlist = currentWishlist.some((m) => m.id === movie.id);
    if (!isAlreadyInWishlist) {
        const updatedWishlist = [...currentWishlist, movie];
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(updatedWishlist));
    }
};

// 찜 목록에서 영화 제거
export const removeFromWishlist = (movieId: number): void => {
    const currentWishlist = getWishlist();
    const updatedWishlist = currentWishlist.filter((movie) => movie.id !== movieId);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updatedWishlist));
};