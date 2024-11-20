import React from "react";
import {Movie} from "../../models/Movie";
import "./MovieCard.css";

interface MovieCardProps {
    movie: Movie;
    width?: string; // 카드의 가로 크기를 조정할 수 있는 prop 추가
    height?: string; // 카드의 세로 크기를 조정할 수 있는 prop 추가
}

const MovieCard: React.FC<MovieCardProps> = ({movie, width = "100%", height = "auto"}) => {
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null;

    return (
        <div className="movie-card" style={{width, height}}>
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