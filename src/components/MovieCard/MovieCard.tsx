import {Movie} from "../../models/Movie";
import "./MovieCard.css";

interface MovieCardProps {
    movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({movie}) => {
    return (
        <div className="movie-card">
            <img
                className="movie-poster"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
            />
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