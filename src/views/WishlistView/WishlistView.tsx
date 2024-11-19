import React from "react";
import {usePreference} from "../../hooks/usePreference";
import MovieCard from "../../components/MovieCard/MovieCard";
import "./WishlistView.css";

const WishlistView: React.FC = () => {
    const {wishlist, removeFromWishlist} = usePreference();

    return (
        <div className="wishlist-view">
            <h1 className="wishlist-title">🎥 My Wishlist</h1>
            {wishlist.length === 0 ? (
                <p className="empty-message">찜한 영화가 없습니다. 마음에 드는 영화를 추가해 보세요!</p>
            ) : (
                <div className="wishlist-container">
                    {wishlist.map((movie) => (
                        <div key={movie.id} className="wishlist-card">
                            <MovieCard movie={movie}/>
                            <button
                                className="wishlist-remove-button"
                                onClick={() => removeFromWishlist(movie.id)}
                            >
                                ❌ 제거
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistView;