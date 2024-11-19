import {getWishlist, addToWishlist, removeFromWishlist} from "../services/userPreferenceService";
import {Movie} from "../models/Movie";

// 찜 목록 가져오기
export const fetchWishlist = (): Movie[] => {
    return getWishlist();
};

// 찜 목록에 영화 추가 (중복 제거 포함)
export const addMovieToWishlist = (movie: Movie): void => {
    addToWishlist(movie);
};

// 찜 목록에서 영화 제거
export const removeMovieFromWishlist = (movieId: number): void => {
    removeFromWishlist(movieId);
};