import React from "react";
import {Movie} from "../../models/Movie";
import "./MovieCard.css";

interface MovieCardProps {
    movie: Movie; // 영화 데이터 (Movie 타입)
    width?: string; // 카드의 너비 (기본값: 100%)
    height?: string; // 카드의 높이 (기본값: auto)
}

const MovieCard: React.FC<MovieCardProps> = ({movie, width = "100%", height = "auto"}) => {
    // 영화의 포스터 URL을 가져오기
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` // 포스터가 존재하면 해당 URL을 사용
        : null; // 포스터가 없으면 null

    return (
        <div className="movie-card" style={{width, height}}>
            {/* 포스터 이미지가 있으면 표시, 없으면 placeholder 표시 */}
            {posterUrl ? (
                <img
                    className="movie-poster"
                    src={posterUrl} // 포스터 이미지 URL
                    alt={movie.title} // 이미지 설명 (영화 제목)
                />
            ) : (
                <div className="no-image-placeholder">
                    이미지 없음 {/* 포스터가 없을 경우 placeholder 텍스트 */}
                </div>
            )}
            <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3> {/* 영화 제목 */}
                <div className="movie-rating">
                    ⭐ {movie.vote_average.toFixed(1)} / 10 {/* 영화 평점 */}
                </div>
            </div>
        </div>
    );
};

export default MovieCard;