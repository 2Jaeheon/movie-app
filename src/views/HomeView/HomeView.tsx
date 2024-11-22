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
} from "../../controllers/MovieController"; // 영화 데이터 관련 API 호출 함수들
import {usePreference} from "../../hooks/usePreference"; // 찜 목록 관련 훅
import MovieList from "../../components/MovieList/MovieList"; // 영화 목록 컴포넌트
import MovieModal from "../../components/MovieModal/MovieModal"; // 영화 상세 모달 컴포넌트
import ErrorComponent from "../../components/Error/ErrorComponent"; // 오류 발생 시 보여줄 컴포넌트
import {Movie} from "../../models/Movie"; // Movie 모델
import "./HomeView.css";

const HomeView: React.FC = () => {
    // 영화 데이터를 저장할 상태들
    const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
    const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
    const [actionMovies, setActionMovies] = useState<Movie[]>([]);
    const [romanceMovies, setRomanceMovies] = useState<Movie[]>([]);
    const [dramaMovies, setDramaMovies] = useState<Movie[]>([]);
    const [classicMovies, setClassicMovies] = useState<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null); // 선택된 영화
    const [currentBannerMovie, setCurrentBannerMovie] = useState<Movie | null>(null); // 배너에 표시할 영화
    const [movieDetails, setMovieDetails] = useState<any | null>(null); // 영화 상세 정보
    const [videoUrl, setVideoUrl] = useState<string | null>(null); // 영화 트레일러 URL
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기/닫기 상태
    const [error, setError] = useState<string | null>(null); // 에러 메시지 상태

    const {wishlist, addToWishlist, removeFromWishlist} = usePreference(); // 찜 목록 관련 훅

    // 컴포넌트 마운트 시 영화 데이터 가져오기
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                // 각종 영화 데이터 API 호출
                const nowPlaying = await fetchNowPlayingMovies();
                const trending = await fetchTrendingMovies();
                const popular = await fetchPopularMovies();
                const action = await fetchActionMovies();
                const romance = await fetchRomanceMovies();
                const drama = await fetchDramaMovies();
                const classics = await fetchClassicMovies();

                // 영화 데이터 상태 설정
                setNowPlayingMovies(nowPlaying);
                setPopularMovies(popular);
                setActionMovies(action);
                setRomanceMovies(romance);
                setDramaMovies(drama);
                setClassicMovies(classics);

                // 트렌딩 영화 중 랜덤으로 배너 영화 선택
                if (trending.length > 0) {
                    const randomIndex = Math.floor(Math.random() * trending.length);
                    setCurrentBannerMovie(trending[randomIndex]);
                }
            } catch (err) {
                setError("API 호출 실패: TMDB API 키를 확인해주세요."); // API 호출 실패 시 에러 메시지 설정
            }
        };

        fetchMovies();
    }, []);

    // 영화 정보 더보기 버튼 클릭 시 처리
    const handleMoreInfo = async (movie: Movie) => {
        setSelectedMovie(movie); // 선택된 영화 설정
        try {
            const details = await fetchMovieDetails(movie.id); // 영화 상세 정보 가져오기
            setMovieDetails(details);

            const trailerUrl = await fetchMovieVideos(movie.id); // 영화 트레일러 URL 가져오기
            setVideoUrl(trailerUrl);
            setIsModalOpen(true); // 모달 열기
        } catch {
            alert("영화 정보를 가져오는데 실패했습니다. 다시 시도해주세요.");
        }
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setSelectedMovie(null);
            setMovieDetails(null);
            setVideoUrl(null);
        }, 300); // 모달 닫기 애니메이션 후 상태 초기화
    };

    // 영화가 찜 목록에 있는지 확인
    const isInWishlist = (movie: Movie) => {
        return wishlist.some((m) => m.id === movie.id);
    };

    // 찜 목록 토글 (추가/제거)
    const handleWishlistToggle = () => {
        if (selectedMovie) {
            isInWishlist(selectedMovie)
                ? removeFromWishlist(selectedMovie.id)
                : addToWishlist(selectedMovie);
        }
    };

    // 에러 발생 시 ErrorComponent 렌더링
    if (error) {
        return (
            <ErrorComponent
                errorMessage={error}
                onRetry={() => window.location.reload()} // 에러 발생 시 새로 고침
            />
        );
    }

    return (
        <div className="home-view">
            {/* 배너 영화 표시 */}
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
                {/* 다양한 영화 목록을 표시 */}
                <MovieList title="Now Playing Movies" movies={nowPlayingMovies} onMovieClick={handleMoreInfo}/>
                <MovieList title="Popular Movies" movies={popularMovies} onMovieClick={handleMoreInfo}/>
                <MovieList title="Action Movies" movies={actionMovies} onMovieClick={handleMoreInfo}/>
                <MovieList title="Romance Movies" movies={romanceMovies} onMovieClick={handleMoreInfo}/>
                <MovieList title="Drama Movies" movies={dramaMovies} onMovieClick={handleMoreInfo}/>
                <MovieList title="Classic Movies" movies={classicMovies} onMovieClick={handleMoreInfo}/>
            </div>

            {/* MovieModal 컴포넌트 사용 (영화 상세보기 모달) */}
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