import React, {useEffect, useState} from "react";
import {
    fetchNowPlayingMovies,
    fetchTrendingMovies,
    fetchPopularMovies,
    fetchMovieVideos,
    fetchMovieDetails,
    fetchActionMovies,
    fetchRomanceMovies,
    fetchDramaMovies,
    fetchClassicMovies,
} from "../../controllers/MovieController";
import {usePreference} from "../../hooks/usePreference";
import MovieList from "../../components/MovieList/MovieList";
import MovieModal from "../../components/MovieModal/MovieModal";
import {Movie} from "../../models/Movie";
import "./HomeView.css";

const HomeView: React.FC = () => {
    const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
    const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
    const [actionMovies, setActionMovies] = useState<Movie[]>([]);
    const [romanceMovies, setRomanceMovies] = useState<Movie[]>([]);
    const [dramaMovies, setDramaMovies] = useState<Movie[]>([]);
    const [classicMovies, setClassicMovies] = useState<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [currentBannerMovie, setCurrentBannerMovie] = useState<Movie | null>(null);
    const [movieDetails, setMovieDetails] = useState<any | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {wishlist, addToWishlist, removeFromWishlist} = usePreference();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const nowPlaying = await fetchNowPlayingMovies();
                const trending = await fetchTrendingMovies();
                const popular = await fetchPopularMovies();
                const action = await fetchActionMovies();
                const romance = await fetchRomanceMovies();
                const drama = await fetchDramaMovies();
                const classics = await fetchClassicMovies();

                setNowPlayingMovies(nowPlaying);
                setPopularMovies(popular);
                setActionMovies(action);
                setRomanceMovies(romance);
                setDramaMovies(drama);
                setClassicMovies(classics);

                if (trending.length > 0) {
                    const randomIndex = Math.floor(Math.random() * trending.length);
                    setCurrentBannerMovie(trending[randomIndex]);
                }
            } catch (err) {
                setError("API 호출 실패: TMDB API 키를 확인해주세요.");
            }
        };

        fetchMovies();
    }, []);

    const handleMoreInfo = async (movie: Movie) => {
        setSelectedMovie(movie);
        try {
            const details = await fetchMovieDetails(movie.id);
            setMovieDetails(details);

            const trailerUrl = await fetchMovieVideos(movie.id);
            setVideoUrl(trailerUrl);
            setIsModalOpen(true);
        } catch {
            alert("영화 정보를 가져오는데 실패했습니다. 다시 시도해주세요.");
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

    const isInWishlist = (movie: Movie) => {
        return wishlist.some((m) => m.id === movie.id);
    };

    const handleWishlistToggle = () => {
        if (selectedMovie) {
            isInWishlist(selectedMovie)
                ? removeFromWishlist(selectedMovie.id)
                : addToWishlist(selectedMovie);
        }
    };

    if (error) {
        return (
            <div className="error-view">
                <h1 className="error-title">에러 발생!</h1>
                <p className="error-message">{error}</p>
                <p className="error-description">
                    현재 영화 데이터를 불러올 수 없습니다. API 키를 확인하거나 나중에 다시 시도해주세요.
                </p>
                <button
                    className="retry-button"
                    onClick={() => window.location.reload()}
                >
                    다시 시도하기
                </button>
            </div>
        );
    }

    return (
        <div className="home-view">
            {currentBannerMovie && (
                <div
                    className="banner"
                    style={{
                        backgroundImage: currentBannerMovie?.backdrop_path
                            ? `linear-gradient(to bottom, rgba(74,20,140,0.6), rgba(48,63,159,0.7)), url(https://image.tmdb.org/t/p/original/${currentBannerMovie.backdrop_path})`
                            : `linear-gradient(to bottom, #5e35b1, #311b92)`,
                    }}
                >
                    <div className="banner-content">
                        <h1 className="banner-title">{currentBannerMovie?.title}</h1>
                        <p className="banner-description">{currentBannerMovie?.overview}</p>
                        <div className="banner-buttons">
                            <button
                                className="play-button"
                                onClick={async () => {
                                    if (currentBannerMovie) {
                                        try {
                                            const trailerUrl = await fetchMovieVideos(currentBannerMovie.id);

                                            if (trailerUrl) {
                                                const parsedUrl = new URL(trailerUrl);

                                                // URL에 autoplay 쿼리 파라미터 추가
                                                parsedUrl.searchParams.set("autoplay", "1");
                                                window.open(parsedUrl.toString(), "_blank");
                                            } else {
                                                alert("Trailer not available.");
                                            }
                                        } catch (error) {
                                            alert("트레일러를 가져오는데 실패했습니다.");
                                            console.error("Error fetching trailer URL:", error);
                                        }
                                    }
                                }}
                            >
                                ▶ Play
                            </button>
                            <button
                                className="info-button"
                                onClick={() => handleMoreInfo(currentBannerMovie!)}
                            >
                                ℹ More Info
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="movie-lists fade-in">
                <MovieList title="Now Playing Movies" movies={nowPlayingMovies} onMovieClick={handleMoreInfo}/>
                <MovieList title="Popular Movies" movies={popularMovies} onMovieClick={handleMoreInfo}/>
                <MovieList title="Action Movies" movies={actionMovies} onMovieClick={handleMoreInfo}/>
                <MovieList title="Romance Movies" movies={romanceMovies} onMovieClick={handleMoreInfo}/>
                <MovieList title="Drama Movies" movies={dramaMovies} onMovieClick={handleMoreInfo}/>
                <MovieList title="Classic Movies" movies={classicMovies} onMovieClick={handleMoreInfo}/>
            </div>

            {/* MovieModal 사용 */}
            <MovieModal
                isOpen={isModalOpen}
                movie={selectedMovie}
                movieDetails={movieDetails}
                videoUrl={videoUrl}
                onClose={handleCloseModal}
                onWishlistToggle={handleWishlistToggle}
                isInWishlist={selectedMovie ? isInWishlist(selectedMovie) : false}
            />
        </div>
    );
};

export default HomeView;