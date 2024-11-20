import {useState, useEffect} from "react";
import {fetchWishlist, addMovieToWishlist, removeMovieFromWishlist} from "../controllers/userPreferenceController";
import {Movie} from "../models/Movie";

export const usePreference = () => {
    const [wishlist, setWishlist] = useState<Movie[]>([]);

    useEffect(() => {
        const initialWishlist = fetchWishlist();
        setWishlist(initialWishlist);
    }, []);

    const addToWishlist = (movie: Movie) => {
        if (!wishlist.some((m) => m.id === movie.id)) { // 중복 확인
            addMovieToWishlist(movie);
            setWishlist(fetchWishlist());
        }
    };

    const removeFromWishlist = (movieId: number) => {
        removeMovieFromWishlist(movieId);
        setWishlist(fetchWishlist());
    };

    return {wishlist, addToWishlist, removeFromWishlist};
};