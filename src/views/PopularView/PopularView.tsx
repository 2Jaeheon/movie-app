import React, {useEffect, useState} from "react";
import {
    fetchPopularMoviesInfinite,
    fetchPopularMoviesPaginated,
    fetchMovieDetails,
    fetchMovieVideos,
} from "../../controllers/MovieController";
import Pagination from "../../components/Pagination/Pagination";
import {usePagination} from "../../hooks/usePagination";
import {useInfiniteScroll} from "../../hooks/useInfiniteScroll";
import {usePreference} from "../../hooks/usePreference";
import MovieModal from "../../components/MovieModal/MovieModal";
import MovieCard from "../../components/MovieCard/MovieCard";
import ErrorComponent from "../../components/Error/ErrorComponent"; // ErrorComponent 추가
import {Movie} from "../../models/Movie";
import "./PopularView.css";

const PopularView: React.FC = () => {
    const [isPagination, setIsPagination] = useState<boolean | null>(null); // 모드 선택 상태
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // 초기 로딩 상태
    const [currentInfinitePage, setCurrentInfinitePage] = useState<number>(1); // 무한 스크롤 페이지 번호
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [movieDetails, setMovieDetails] = useState<any | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [, setLoadedMovieIds] = useState<Set<number>>(new Set()); // 중복 방지
    const [error, setError] = useState<string | null>(null); // 에러 상태 추가
    const [showScrollToTop, setShowScrollToTop] = useState(false);  // 상태 추가: Scroll to Top 버튼

    const {wishlist, addToWishlist, removeFromWishlist} = usePreference();
    const {currentPage, totalPages, setTotalPages, goToNextPage, goToPrevPage, setPage} =
        usePagination();

    const {isFetching} = useInfiniteScroll(async () => {
        if (!isPagination) {
            try {
                const nextPage = currentInfinitePage + 1;
                setLoading(true);
                const newMovies = await fetchPopularMoviesInfinite(nextPage);

                // 중복 제거 로직
                setMovies((prevMovies) => {
                    const uniqueMovies = newMovies.filter(
                        (movie) => !prevMovies.some((prevMovie) => prevMovie.id === movie.id)
                    );
                    return [...prevMovies, ...uniqueMovies];
                });

                setLoadedMovieIds((prev) => {
                    const updatedSet = new Set(prev);
                    newMovies.forEach((movie) => updatedSet.add(movie.id));
                    return updatedSet;
                });

                setCurrentInfinitePage(nextPage);
            } catch {
                setError("영화 데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
            } finally {
                setLoading(false);
            }
        }
    });

    const isInWishlist = (movie: Movie) => wishlist.some((m) => m.id === movie.id);

    const handleWishlistToggle = () => {
        if (selectedMovie) {
            isInWishlist(selectedMovie)
                ? removeFromWishlist(selectedMovie.id)
                : addToWishlist(selectedMovie);
        }
    };

    const loadMoviesPaginated = async (page: number) => {
        try {
            setLoading(true);
            const paginatedMovies = await fetchPopularMoviesPaginated(page);
            setMovies(paginatedMovies);
            setLoadedMovieIds(new Set(paginatedMovies.map((movie) => movie.id)));
            setTotalPages(10);
        } catch {
            setError("페이지네이션 데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    const handlePagination = async () => {
        setIsPagination(true);
        await loadMoviesPaginated(1);
        setPage(1);
    };

    const handleInfiniteScroll = async () => {
        try {
            setIsPagination(false);
            const initialMovies = await fetchPopularMoviesInfinite(1);
            setMovies(initialMovies);
            setLoadedMovieIds(new Set(initialMovies.map((movie) => movie.id)));
            setCurrentInfinitePage(1);
        } catch {
            setError("무한 스크롤 데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
        }
    };

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

    // 첫 API 호출로 연결 상태 확인
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const initialMovies = await fetchPopularMoviesInfinite(1);
                setMovies(initialMovies);
                setLoadedMovieIds(new Set(initialMovies.map((movie) => movie.id)));
                setError(null); // 성공하면 에러 초기화
            } catch {
                setError("초기 데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollToTop(true);
            } else {
                setShowScrollToTop(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (error) {
        return (
            <ErrorComponent
                errorMessage={error}
                onRetry={() => window.location.reload()}
            />
        );
    }

    if (isPagination === null) {
        return (
            <div className="mode-selection">
                <h2>어떤 방법으로 보실래요?</h2>
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
            <h1 className="popular-title">Popular Movies</h1>
            <div className="movie-grid">
                {movies.map((movie) => (
                    <div key={movie.id} onClick={() => handleMoreInfo(movie)}>
                        <MovieCard movie={movie} width="100%" height="auto"/>
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

            <MovieModal
                isOpen={isModalOpen}
                movie={selectedMovie}
                movieDetails={movieDetails}
                videoUrl={videoUrl}
                onClose={handleCloseModal}
                onWishlistToggle={handleWishlistToggle}
                isInWishlist={selectedMovie ? isInWishlist(selectedMovie) : false}
            />

            {/* Scroll to Top Button */}
            {showScrollToTop && (
                <button className="scroll-to-top" onClick={scrollToTop}>
                    ▲
                </button>
            )}
        </div>
    );
};

export default PopularView;