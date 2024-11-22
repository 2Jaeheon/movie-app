import React, {useEffect, useState} from "react";
import {
    fetchPopularMoviesInfinite,
    fetchPopularMoviesPaginated,
    fetchMovieDetails,
    fetchMovieVideos,
} from "../../controllers/MovieController"; // 영화 관련 API 호출 함수들
import Pagination from "../../components/Pagination/Pagination"; // 페이지네이션 컴포넌트
import {usePagination} from "../../hooks/usePagination"; // 페이지네이션 훅
import {useInfiniteScroll} from "../../hooks/useInfiniteScroll"; // 무한 스크롤 훅
import {usePreference} from "../../hooks/usePreference"; // 찜 목록 관련 훅
import MovieModal from "../../components/MovieModal/MovieModal"; // 영화 상세보기 모달 컴포넌트
import MovieCard from "../../components/MovieCard/MovieCard"; // 영화 카드 컴포넌트
import ErrorComponent from "../../components/Error/ErrorComponent"; // 에러 발생 시 보여줄 컴포넌트
import {Movie} from "../../models/Movie"; // 영화 타입 모델
import "./PopularView.css";

const PopularView: React.FC = () => {
    const [isPagination, setIsPagination] = useState<boolean | null>(null); // 페이지네이션 또는 무한 스크롤 모드 설정
    const [movies, setMovies] = useState<Movie[]>([]); // 영화 데이터 상태
    const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
    const [currentInfinitePage, setCurrentInfinitePage] = useState<number>(1); // 현재 무한 스크롤 페이지 번호
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null); // 선택된 영화 상태
    const [movieDetails, setMovieDetails] = useState<any | null>(null); // 영화 상세 정보 상태
    const [videoUrl, setVideoUrl] = useState<string | null>(null); // 트레일러 URL 상태
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 모달 열기 상태
    const [, setLoadedMovieIds] = useState<Set<number>>(new Set()); // 중복된 영화 ID를 저장하는 Set
    const [error, setError] = useState<string | null>(null); // 에러 메시지 상태
    const [showScrollToTop, setShowScrollToTop] = useState(false); // Scroll to Top 버튼 표시 여부

    const {wishlist, addToWishlist, removeFromWishlist} = usePreference(); // 찜 목록 관련 훅
    const {currentPage, totalPages, setTotalPages, goToNextPage, goToPrevPage, setPage} =
        usePagination(); // 페이지네이션 훅 사용

    const {isFetching} = useInfiniteScroll(async () => {
        // 무한 스크롤 로직
        if (!isPagination) {
            try {
                const nextPage = currentInfinitePage + 1; // 다음 페이지 번호
                setLoading(true);
                const newMovies = await fetchPopularMoviesInfinite(nextPage);

                // 중복된 영화 제거 후 상태 업데이트
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

                setCurrentInfinitePage(nextPage); // 페이지 번호 업데이트
            } catch {
                setError("영화 데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
            } finally {
                setLoading(false);
            }
        }
    });

    const isInWishlist = (movie: Movie) => {
        // 영화가 찜 목록에 있는지 확인
        return wishlist.some((m) => m.id === movie.id);
    };

    const handleWishlistToggle = () => {
        // 선택된 영화의 찜 목록 추가/제거
        if (selectedMovie) {
            isInWishlist(selectedMovie)
                ? removeFromWishlist(selectedMovie.id)
                : addToWishlist(selectedMovie);
        }
    };

    // 페이지네이션 모드일 때 스크롤 비활성화
    useEffect(() => {
        if (isPagination) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto"; // 컴포넌트 언마운트 시 스크롤 복원
        };
    }, [isPagination]);

    const loadMoviesPaginated = async (page: number) => {
        // 페이지네이션 로딩 함수
        try {
            setLoading(true);
            const paginatedMovies = await fetchPopularMoviesPaginated(page);
            setMovies(paginatedMovies);
            setLoadedMovieIds(new Set(paginatedMovies.map((movie) => movie.id)));
            setTotalPages(10); // 페이지 수 설정
        } catch {
            setError("페이지네이션 데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    const handlePagination = async () => {
        // 페이지네이션 모드 활성화
        setIsPagination(true);
        await loadMoviesPaginated(1); // 첫 번째 페이지 로드
        setPage(1);
    };

    const handleInfiniteScroll = async () => {
        // 무한 스크롤 모드 활성화
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
        // 영화 클릭 시 상세 정보 모달 열기
        setSelectedMovie(movie);
        try {
            const details = await fetchMovieDetails(movie.id); // 영화 상세 정보
            setMovieDetails(details);

            const trailerUrl = await fetchMovieVideos(movie.id); // 영화 트레일러 URL
            setVideoUrl(trailerUrl);
            setIsModalOpen(true);
        } catch {
            alert("영화 정보를 가져오는데 실패했습니다. 다시 시도해주세요.");
        }
    };

    const handleCloseModal = () => {
        // 모달 닫기
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
        // 스크롤에 따른 Scroll to Top 버튼 표시
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollToTop(true); // 300px 이상 스크롤 시 버튼 표시
            } else {
                setShowScrollToTop(false); // 300px 미만 시 버튼 숨기기
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        // 페이지 상단으로 스크롤 이동
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // 에러 발생 시 ErrorComponent 렌더링
    if (error) {
        return (
            <ErrorComponent
                errorMessage={error}
                onRetry={() => window.location.reload()} // 새로 고침 버튼
            />
        );
    }

    // 모드 선택 화면 렌더링
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
                {/* 영화 목록 렌더링 */}
                {movies.map((movie) => (
                    <div key={movie.id} onClick={() => handleMoreInfo(movie)}>
                        <MovieCard movie={movie} width="100%" height="auto"/>
                    </div>
                ))}
            </div>

            {/* 페이지네이션 모드일 경우 */}
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

            {/* 무한 스크롤일 경우 로딩 중 표시 */}
            {!isPagination && isFetching && <p className="loading-text">데이터 로딩 중...</p>}
            {loading && <div className="loader"></div>}

            {/* 영화 상세보기 모달 */}
            <MovieModal
                isOpen={isModalOpen}
                movie={selectedMovie}
                movieDetails={movieDetails}
                videoUrl={videoUrl}
                onClose={handleCloseModal}
                onWishlistToggle={handleWishlistToggle}
                isInWishlist={selectedMovie ? isInWishlist(selectedMovie) : false}
            />

            {/* Scroll to Top 버튼 */}
            {showScrollToTop && (
                <button className="scroll-to-top" onClick={scrollToTop}>
                    ▲
                </button>
            )}
        </div>
    );
};

export default PopularView;