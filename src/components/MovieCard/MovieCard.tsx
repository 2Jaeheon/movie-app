import React from "react";
import {Movie} from "../../models/Movie";
import "./MovieCard.css";

interface MovieCardProps {
    movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({movie}) => {
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null;

    return (
        <div className="movie-card">
            {posterUrl ? (
                <img
                    className="movie-poster"
                    src={posterUrl}
                    alt={movie.title}
                />
            ) : (
                <div className="no-image-placeholder">
                    이미지 없음
                </div>
            )}
            <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <div className="movie-rating">
                    ⭐ {movie.vote_average.toFixed(1)} / 10
                </div>
            </div>
        </div>
    );
};

export default MovieCard;