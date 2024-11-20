import React from "react";
import {Movie} from "../../models/Movie";
import MovieCard from "../MovieCard/MovieCard";
import "./MovieList.css";

interface MovieListProps {
    title: string;
    movies: Movie[];
    onMovieClick: (movie: Movie) => void;
}

const MovieList: React.FC<MovieListProps> = ({title, movies, onMovieClick}) => {
    return (
        <div className="movie-list">
            <h2 className="movie-list-title">{title}</h2>
            <div className="movie-list-scroll">
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        onClick={() => onMovieClick(movie)}
                        className="movie-item-wrapper"
                    >
                        {/* MovieCard에 동적 width와 height 추가 */}
                        <MovieCard movie={movie} width="100%" height="auto"/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovieList;