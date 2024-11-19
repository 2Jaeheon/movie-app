import React, {useState} from "react";
import {
    fetchPopularMoviesInfinite,
    fetchPopularMoviesPaginated,
    fetchMovieDetails,
    fetchMovieVideos,
} from "../../controllers/MovieController";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/common/Modal";
import {usePagination} from "../../hooks/usePagination";
import {useInfiniteScroll} from "../../hooks/useInfiniteScroll";
import {Movie} from "../../models/Movie";
import "./PopularView.css";
import {usePreference} from "../../hooks/usePreference";

const PopularView: React.FC = () => {
    const [isPagination, setIsPagination] = useState<boolean | null>(null); // 모드 선택 상태
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentInfinitePage, setCurrentInfinitePage] = useState<number>(1); // 무한 스크롤 페이지 번호
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [movieDetails, setMovieDetails] = useState<any | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [loadedMovieIds, setLoadedMovieIds] = useState<Set<number>>(new Set()); // 중복 방지

    const {wishlist, addToWishlist, removeFromWishlist} = usePreference(); // usePreference에서 추가/제거 로직 가져오기

    // 페이지네이션 훅
    const {currentPage, totalPages, setTotalPages, goToNextPage, goToPrevPage, setPage} =
        usePagination();

    // 무한 스크롤 훅
    const {isFetching} = useInfiniteScroll(async () => {
        if (!isPagination) {
            const nextPage = currentInfinitePage + 1;
            setLoading(true);
            const newMovies = await fetchPopularMoviesInfinite(nextPage);

            // 새로운 영화만 추가
            const filteredMovies = newMovies.filter((movie) => !loadedMovieIds.has(movie.id));
            setMovies((prev) => [...prev, ...filteredMovies]);

            // 로드된 영화 ID 추적
            setLoadedMovieIds((prev) => {
                const updatedSet = new Set(prev);
                filteredMovies.forEach((movie) => updatedSet.add(movie.id));
                return updatedSet;
            });

            setCurrentInfinitePage(nextPage);
            setLoading(false);
        }
    });

    const isInWishlist = (movie: Movie) => {
        return wishlist.some((m) => m.id === movie.id);
    };

    const handleWishlistAction = (movie: Movie) => {
        if (isInWishlist(movie)) {
            removeFromWishlist(movie.id);
        } else {
            addToWishlist(movie);
        }
    };


    // 페이지네이션 데이터 로드
    const loadMoviesPaginated = async (page: number) => {
        setLoading(true);
        const paginatedMovies = await fetchPopularMoviesPaginated(page);
        setMovies(paginatedMovies);
        setLoadedMovieIds(new Set(paginatedMovies.map((movie) => movie.id))); // 초기화
        setTotalPages(10); // 예: API에서 제공하는 총 페이지 수
        setLoading(false);
    };

    // 페이지네이션 모드로 전환
    const handlePagination = async () => {
        setIsPagination(true);
        await loadMoviesPaginated(1);
        setPage(1);
    };

    // 무한 스크롤 모드로 전환
    const handleInfiniteScroll = async () => {
        setIsPagination(false);
        const initialMovies = await fetchPopularMoviesInfinite(1);
        setMovies(initialMovies);
        setLoadedMovieIds(new Set(initialMovies.map((movie) => movie.id))); // 초기화
        setCurrentInfinitePage(1);
    };

    // 영화 클릭 시 상세 정보 로드 및 모달 열기
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

    // 모달 닫기
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setSelectedMovie(null);
            setMovieDetails(null);
            setVideoUrl(null);
        }, 300);
    };

    // 초기 UI: 모드 선택
    if (isPagination === null) {
        return (
            <div className="mode-selection">
                <h2>영화 데이터를 어떻게 보시겠습니까?</h2>
                <div className="mode-buttons">
                    <button className="mode-button" onClick={handlePagination}>
                        페이지네이션
                    </button>
                    <button className="mode-button" onClick={handleInfiniteScroll}>
                        무한 스크롤
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="popular-view">
            <h1 className="popular-title">인기 영화</h1>
            <div className="movie-grid">
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        className="movie-item"
                        onClick={() => handleMoreInfo(movie)}
                    >
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="movie-poster"
                        />
                        <div className="movie-overlay">
                            <h3 className="movie-title">{movie.title}</h3>
                            <p className="movie-rating">⭐ {movie.vote_average}</p>
                        </div>
                    </div>
                ))}
            </div>

            {isPagination && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onNext={async () => {
                        const nextPage = currentPage + 1;
                        goToNextPage();
                        await loadMoviesPaginated(nextPage);
                    }}
                    onPrev={async () => {
                        const prevPage = currentPage - 1;
                        goToPrevPage();
                        await loadMoviesPaginated(prevPage);
                    }}
                />
            )}

            {!isPagination && isFetching && <p className="loading-text">데이터 로딩 중...</p>}
            {loading && <div className="loader"></div>}

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
                                    <button
                                        className="modal-button action"
                                        data-in-wishlist={selectedMovie && isInWishlist(selectedMovie)}
                                        onClick={() => selectedMovie && handleWishlistAction(selectedMovie)}
                                    >
                                        {selectedMovie && isInWishlist(selectedMovie)
                                            ? "Remove from Wishlist"
                                            : "Add to Wishlist"}
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

export default PopularView;