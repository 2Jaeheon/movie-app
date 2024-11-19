import React, {useState} from "react";
import {usePreference} from "../../hooks/usePreference";
import MovieCard from "../../components/MovieCard/MovieCard";
import MovieModal from "../../components/MovieModal/MovieModal";
import {fetchMovieVideos, fetchMovieDetails} from "../../controllers/MovieController";
import {Movie} from "../../models/Movie";
import "./WishlistView.css";

const WishlistView: React.FC = () => {
    const {wishlist, removeFromWishlist} = usePreference();
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [movieDetails, setMovieDetails] = useState<any | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    const handleMovieClick = async (movie: Movie) => {
        setSelectedMovie(movie);
        try {
            const details = await fetchMovieDetails(movie.id);
            setMovieDetails(details);

            const trailerUrl = await fetchMovieVideos(movie.id);
            setVideoUrl(trailerUrl);
            setIsModalOpen(true);
        } catch {
            alert("Failed to fetch movie details. Please try again.");
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setSelectedMovie(null);
            setMovieDetails(null);
            setVideoUrl(null);
        }, 300);
    };

    const handleWishlistRemove = (movieId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        removeFromWishlist(movieId);
    };

    return (
        <div className="wishlist-view">
            <header className="wishlist-header">
                <h1>✨ My Movie Wishlist</h1>
            </header>

            {wishlist.length === 0 ? (
                <div className="wishlist-empty">
                    <p>Your wishlist is empty.<br/>Add movies you love!</p>
                </div>
            ) : (
                <div className="wishlist-grid">
                    {wishlist.map((movie) => (
                            <div key={movie.id} className="wishlist-card">
                                <div
                                    className="wishlist-movie"
                                    onClick={() => handleMovieClick(movie)}
                                >
                                    <MovieCard movie={movie}/>
                                    <div className="wishlist-overlay">
                                        <button
                                            className="remove-btn"
                                            onClick={(e) => handleWishlistRemove(movie.id, e)}
                                        >
                                            ✖
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}

            <MovieModal
                isOpen={isModalOpen}
                movie={selectedMovie}
                movieDetails={movieDetails}
                videoUrl={videoUrl}
                onClose={handleCloseModal}
                onWishlistToggle={() => {
                    if (selectedMovie) handleWishlistRemove(selectedMovie.id, {} as React.MouseEvent);
                }}
                isInWishlist={!!selectedMovie}
            />
        </div>
    )
        ;
};

export default WishlistView;