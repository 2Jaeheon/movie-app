import React, {useEffect, useState, useRef, useCallback} from "react";
import {
    fetchPopularMoviesInfinite,
    fetchPopularMoviesPaginated,
    fetchMovieDetails,
    fetchMovieVideos,
} from "../../controllers/MovieController";
import Pagination from "../../components/Pagination/Pagination";
import {usePagination} from "../../hooks/usePagination";
import {usePreference} from "../../hooks/usePreference";
import MovieModal from "../../components/MovieModal/MovieModal";
import MovieCard from "../../components/MovieCard/MovieCard";
import ErrorComponent from "../../components/Error/ErrorComponent";
import {Movie} from "../../models/Movie";
import "./PopularView.css";

const PopularView: React.FC = () => {
    const [isPagination, setIsPagination] = useState<boolean | null>(null);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentInfinitePage, setCurrentInfinitePage] = useState<number>(1);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [movieDetails, setMovieDetails] = useState<any | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showScrollToTop, setShowScrollToTop] = useState(false);

    const {wishlist, addToWishlist, removeFromWishlist} = usePreference();
    const {currentPage, totalPages, setTotalPages, goToNextPage, goToPrevPage, setPage} =
        usePagination();

    const observerRef = useRef<IntersectionObserver | null>(null);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    const loadMoreMovies = useCallback(async () => {
        try {
            setLoading(true);
            const nextPage = currentInfinitePage + 1;
            const newMovies = await fetchPopularMoviesInfinite(nextPage);

            setMovies((prevMovies) => {
                const uniqueMovies = newMovies.filter(
                    (movie) => !prevMovies.some((prevMovie) => prevMovie.id === movie.id)
                );
                return [...prevMovies, ...uniqueMovies];
            });

            setCurrentInfinitePage(nextPage);
        } catch {
            setError("영화 데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    }, [currentInfinitePage]);

    useEffect(() => {
        if (isPagination === false) {
            observerRef.current = new IntersectionObserver(
                async ([entry]) => {
                    if (entry.isIntersecting && !loading) {
                        await loadMoreMovies();
                    }
                },
                {
                    rootMargin: "0px 0px 200px 0px", // 모바일 환경에 맞게 추가적인 여유를 줌
                    threshold: 0.5, // 스크롤이 요소의 50%에 도달했을 때 트리거
                }
            );

            if (loaderRef.current) {
                observerRef.current.observe(loaderRef.current);
            }

            return () => observerRef.current?.disconnect();
        }
    }, [isPagination, loading, loadMoreMovies]);

    // Scroll to Top 버튼 표시 여부 업데이트
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

    const isInWishlist = (movie: Movie) => wishlist.some((m) => m.id === movie.id);

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
            setCurrentInfinitePage(1);
        } catch {
            setError("무한 스크롤 데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
        }
    };

    const loadMoviesPaginated = async (page: number) => {
        try {
            setLoading(true);
            const paginatedMovies = await fetchPopularMoviesPaginated(page);
            setMovies(paginatedMovies);
            setTotalPages(10);
        } catch {
            setError("페이지네이션 데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const initialMovies = await fetchPopularMoviesInfinite(1);
            setMovies(initialMovies);
            setError(null);
        } catch {
            setError("초기 데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
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

            {!isPagination && <div ref={loaderRef} className="loading-text">데이터 로딩 중...</div>}

            <MovieModal
                isOpen={isModalOpen}
                movie={selectedMovie}
                movieDetails={movieDetails}
                videoUrl={videoUrl}
                onClose={handleCloseModal}
                onWishlistToggle={() =>
                    selectedMovie &&
                    (isInWishlist(selectedMovie)
                        ? removeFromWishlist(selectedMovie.id)
                        : addToWishlist(selectedMovie))
                }
                isInWishlist={selectedMovie ? isInWishlist(selectedMovie) : false}
            />

            {showScrollToTop && (
                <button className="scroll-to-top" onClick={scrollToTop}>
                    ▲
                </button>
            )}
        </div>
    );
};

export default PopularView;