import React, {useEffect, useState} from "react";
import {
    fetchNowPlayingMovies, // 현재 상영 중인 영화 데이터 가져오기
    fetchTrendingMovies, // 트렌딩 영화 데이터 가져오기
    fetchPopularMovies, // 인기 영화 데이터 가져오기
    fetchMovieVideos, // 영화의 트레일러 URL 가져오기
    fetchMovieDetails, // 영화 상세 정보 가져오기
    fetchActionMovies, // 액션 장르 영화 데이터 가져오기
    fetchRomanceMovies, // 로맨스 장르 영화 데이터 가져오기
    fetchDramaMovies, // 드라마 장르 영화 데이터 가져오기
    fetchClassicMovies, // 고전 영화 데이터 가져오기
} from "../../controllers/MovieController";
import MovieList from "../../components/MovieList/MovieList"; // 영화 목록 컴포넌트
import Modal from "../../components/common/Modal"; // 모달 컴포넌트
import {Movie} from "../../models/Movie"; // 영화 데이터 타입
import "./HomeView.css"; // 스타일 파일

const HomeView: React.FC = () => {
    // 영화 데이터를 관리하기 위한 상태들
    const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]); // 현재 상영 중인 영화 상태
    const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]); // 트렌딩 영화 상태
    const [popularMovies, setPopularMovies] = useState<Movie[]>([]); // 인기 영화 상태
    const [actionMovies, setActionMovies] = useState<Movie[]>([]); // 액션 영화 상태
    const [romanceMovies, setRomanceMovies] = useState<Movie[]>([]); // 로맨스 영화 상태
    const [dramaMovies, setDramaMovies] = useState<Movie[]>([]); // 드라마 영화 상태
    const [classicMovies, setClassicMovies] = useState<Movie[]>([]); // 고전 영화 상태
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null); // 선택된 영화 정보 상태
    const [currentBannerMovie, setCurrentBannerMovie] = useState<Movie | null>(null); // 배너에 표시할 영화 상태
    const [movieDetails, setMovieDetails] = useState<any | null>(null); // 영화 상세 정보 상태
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
    const [videoUrl, setVideoUrl] = useState<string | null>(null); // 트레일러 URL 상태

    // 컴포넌트가 처음 렌더링될 때 영화 데이터를 가져오는 함수
    useEffect(() => {
        const fetchMovies = async () => {
            const nowPlaying = await fetchNowPlayingMovies(); // 현재 상영 중인 영화 가져오기
            const trending = await fetchTrendingMovies(); // 트렌딩 영화 가져오기
            const popular = await fetchPopularMovies(); // 인기 영화 가져오기
            const action = await fetchActionMovies(); // 액션 영화 가져오기
            const romance = await fetchRomanceMovies(); // 로맨스 영화 가져오기
            const drama = await fetchDramaMovies(); // 드라마 영화 가져오기
            const classics = await fetchClassicMovies(); // 고전 영화 가져오기

            setNowPlayingMovies(nowPlaying); // 현재 상영 중인 영화 상태 업데이트
            setTrendingMovies(trending); // 트렌딩 영화 상태 업데이트
            setPopularMovies(popular); // 인기 영화 상태 업데이트
            setActionMovies(action); // 액션 영화 상태 업데이트
            setRomanceMovies(romance); // 로맨스 영화 상태 업데이트
            setDramaMovies(drama); // 드라마 영화 상태 업데이트
            setClassicMovies(classics); // 고전 영화 상태 업데이트

            // 배너에 표시할 영화는 트렌딩 영화 중 랜덤으로 선택
            if (trending.length > 0) {
                const randomIndex = Math.floor(Math.random() * trending.length);
                setCurrentBannerMovie(trending[randomIndex]);
            }
        };

        fetchMovies(); // 영화 데이터 가져오기
    }, []);

    // 배너 영화를 10초마다 변경하는 로직
    useEffect(() => {
        if (trendingMovies.length > 0) {
            const interval = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * trendingMovies.length);
                setCurrentBannerMovie(trendingMovies[randomIndex]); // 배너 영화 변경
            }, 10000); // 10초 간격으로 변경

            return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
        }
    }, [trendingMovies]);

    // 선택된 영화의 상세 정보와 트레일러를 가져오는 함수
    const handleMoreInfo = async (movie: Movie) => {
        setSelectedMovie(movie); // 선택된 영화 상태 업데이트
        const details = await fetchMovieDetails(movie.id); // 영화 상세 정보 가져오기
        setMovieDetails(details);

        let trailerUrl = await fetchMovieVideos(movie.id); // 트레일러 URL 가져오기

        /*// 트레일러 URL에 자동 재생 파라미터 추가
        if (trailerUrl && trailerUrl.includes("youtube.com")) {
            trailerUrl += trailerUrl.includes("?") ? "&autoplay=1" : "?autoplay=1";
        }
*/
        setVideoUrl(trailerUrl); // 트레일러 URL 상태 업데이트
        setIsModalOpen(true); // 모달 열림 상태로 설정
    };

    // 모달 닫기 함수
    const handleCloseModal = () => {
        setIsModalOpen(false); // 모달 닫힘 상태로 설정
        setTimeout(() => {
            setSelectedMovie(null); // 선택된 영화 초기화
            setMovieDetails(null); // 영화 상세 정보 초기화
            setVideoUrl(null); // 트레일러 URL 초기화
        }, 300);
    };

    return (
        <div className="home-view">
            {/* 배너 */}
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
                                        let trailerUrl = await fetchMovieVideos(currentBannerMovie.id);
                                        if (trailerUrl) {
                                            // 자동 재생 쿼리 파라미터 추가
                                            if (trailerUrl.includes("youtube.com")) {
                                                trailerUrl += trailerUrl.includes("?") ? "&autoplay=1" : "?autoplay=1";
                                            }
                                            window.open(trailerUrl, "_blank");
                                        } else {
                                            alert("Trailer not available.");
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
            <br/>
            {/* 영화 목록 */}
            <MovieList title="Now Playing Movies" movies={nowPlayingMovies}
                       onMovieClick={handleMoreInfo}/> {/* 현재 상영 중 */}
            <MovieList title="Popular Movies" movies={popularMovies} onMovieClick={handleMoreInfo}/>
            <MovieList title="Action Movies" movies={actionMovies} onMovieClick={handleMoreInfo}/>
            <MovieList title="Romance Movies" movies={romanceMovies} onMovieClick={handleMoreInfo}/>
            <MovieList title="Drama Movies" movies={dramaMovies} onMovieClick={handleMoreInfo}/>
            <MovieList title="Classic Movies" movies={classicMovies} onMovieClick={handleMoreInfo}/>

            {/* 모달 */}
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