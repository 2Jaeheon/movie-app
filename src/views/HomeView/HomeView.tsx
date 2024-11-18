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
import MovieList from "../../components/MovieList/MovieList";
import Modal from "../../components/common/Modal";
import {Movie} from "../../models/Movie";
import "./HomeView.css";

const HomeView: React.FC = () => {
    const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
    const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
    const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
    const [actionMovies, setActionMovies] = useState<Movie[]>([]);
    const [romanceMovies, setRomanceMovies] = useState<Movie[]>([]);
    const [dramaMovies, setDramaMovies] = useState<Movie[]>([]);
    const [classicMovies, setClassicMovies] = useState<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [currentBannerMovie, setCurrentBannerMovie] = useState<Movie | null>(null);
    const [movieDetails, setMovieDetails] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

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
                setTrendingMovies(trending);
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

            let trailerUrl = await fetchMovieVideos(movie.id);
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
                                            let trailerUrl = await fetchMovieVideos(currentBannerMovie.id);
                                            if (trailerUrl) {
                                                if (trailerUrl.includes("youtube.com")) {
                                                    trailerUrl += trailerUrl.includes("?") ? "&autoplay=1" : "?autoplay=1";
                                                }
                                                window.open(trailerUrl, "_blank");
                                            } else {
                                                alert("Trailer not available.");
                                            }
                                        } catch {
                                            alert("트레일러를 가져오는데 실패했습니다.");
                                        }
                                    }
                                }}
                            >
                                ▶ Play
                            </button>
                            <button className="info-button" onClick={() => handleMoreInfo(currentBannerMovie!)}>
                                ℹ More Info
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <MovieList title="Now Playing Movies" movies={nowPlayingMovies} onMovieClick={handleMoreInfo}/>
            <MovieList title="Popular Movies" movies={popularMovies} onMovieClick={handleMoreInfo}/>
            <MovieList title="Action Movies" movies={actionMovies} onMovieClick={handleMoreInfo}/>
            <MovieList title="Romance Movies" movies={romanceMovies} onMovieClick={handleMoreInfo}/>
            <MovieList title="Drama Movies" movies={dramaMovies} onMovieClick={handleMoreInfo}/>
            <MovieList title="Classic Movies" movies={classicMovies} onMovieClick={handleMoreInfo}/>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedMovie?.title}>
                    <div className="custom-modal-content">
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
                                <p><strong>Overview:</strong> {movieDetails.overview}</p>
                                <p><strong>Release Date:</strong> {movieDetails.release_date}</p>
                                <p><strong>Rating:</strong> ⭐ {movieDetails.vote_average}</p>
                                <p>
                                    <strong>Director:</strong>{" "}
                                    {movieDetails.credits?.crew?.find((crew: any) => crew.job === "Director")?.name}
                                </p>
                                <p>
                                    <strong>Cast:</strong>{" "}
                                    {movieDetails.credits?.cast?.slice(0, 5).map((actor: any) => actor.name).join(", ")}
                                </p>
                                <p>
                                    <strong>Genres:</strong>{" "}
                                    {movieDetails.genres?.map((genre: any) => genre.name).join(", ")}
                                </p>
                                <div className="modal-actions">
                                    <button className="modal-button close" onClick={handleCloseModal}>
                                        Close
                                    </button>
                                    <button className="modal-button action" onClick={() => alert("Action!")}>
                                        Add to Wishlist
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default HomeView;