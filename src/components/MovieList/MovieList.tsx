import React from "react";
import {Movie} from "../../models/Movie";
import MovieCard from "../MovieCard/MovieCard";
import "./MovieList.css";

interface MovieListProps {
    title: string; // 영화 리스트 제목
    movies: Movie[]; // 영화 배열
    onMovieClick: (movie: Movie) => void; // 영화 클릭 시 처리하는 함수
}

const MovieList: React.FC<MovieListProps> = ({title, movies, onMovieClick}) => {
    return (
        <div className="movie-list">
            <h2 className="movie-list-title">{title}</h2>
            {/* 리스트 제목 표시 */}
            <div className="movie-list-scroll">
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        onClick={() => onMovieClick(movie)} // 영화 클릭 시 onMovieClick 호출
                        className="movie-item-wrapper"
                    >
                        <MovieCard movie={movie} width="100%" height="auto"/>
                        {/* 각 영화에 대한 MovieCard 컴포넌트 */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovieList;