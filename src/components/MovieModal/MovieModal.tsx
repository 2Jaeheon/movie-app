import React from "react";
import Modal from "../common/Modal";
import {Movie} from "../../models/Movie";
import "./MovieModal.css";

interface MovieModalProps {
    isOpen: boolean;
    movie: Movie | null;
    movieDetails: any;
    videoUrl: string | null;
    onClose: () => void;
    onWishlistToggle: () => void;
    isInWishlist: boolean;
}

const MovieModal: React.FC<MovieModalProps> = ({
                                                   isOpen,
                                                   movie,
                                                   movieDetails,
                                                   videoUrl,
                                                   onClose,
                                                   onWishlistToggle,
                                                   isInWishlist,
                                               }) => {
    if (!movie) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={movie.title}>
            <div className="movie-modal-content">
                {videoUrl && (
                    <div className="video-wrapper">
                        <iframe
                            src={videoUrl}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}
                {movieDetails && (
                    <div className="movie-details">
                        <p>
                            <strong>Overview:</strong> {movieDetails.overview}
                        </p>
                        <p>
                            <strong>Release Date:</strong>{" "}
                            {movieDetails.release_date}
                        </p>
                        <p>
                            <strong>Rating:</strong> ⭐ {movieDetails.vote_average}
                        </p>
                        <p>
                            <strong>Director:</strong>{" "}
                            {movieDetails.credits?.crew?.find(
                                (crew: any) => crew.job === "Director"
                            )?.name}
                        </p>
                        <p>
                            <strong>Cast:</strong>{" "}
                            {movieDetails.credits?.cast
                                ?.slice(0, 5)
                                .map((actor: any) => actor.name)
                                .join(", ")}
                        </p>
                        <p>
                            <strong>Genres:</strong>{" "}
                            {movieDetails.genres
                                ?.map((genre: any) => genre.name)
                                .join(", ")}
                        </p>
                        <div className="modal-actions">
                            <button
                                className="modal-button close"
                                onClick={onClose}
                            >
                                Close
                            </button>
                            <button
                                className={`modal-button action ${
                                    isInWishlist ? "remove-button" : "add-button"
                                }`}
                                onClick={onWishlistToggle}
                            >
                                {isInWishlist
                                    ? "Remove from Wishlist"
                                    : "Add to Wishlist"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default MovieModal;