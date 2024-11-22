import React, {useState, useEffect} from "react";
import SearchBar from "../../components/Search/SearchBar";
import SearchFilter from "../../components/Search/SearchFilter";
import {
    fetchMoviesBySearch,
    fetchMoviesByFilters,
    fetchMovieVideos,
    fetchMovieDetails,
} from "../../controllers/MovieController";
import {Movie} from "../../models/Movie";
import {useInfiniteScroll} from "../../hooks/useInfiniteScroll";
import {usePreference} from "../../hooks/usePreference";
import MovieCard from "../../components/MovieCard/MovieCard";
import MovieModal from "../../components/MovieModal/MovieModal";
import "./SearchView.css";

const SearchView: React.FC = () => {
    const [searchMode, setSearchMode] = useState<"bar" | "filter" | null>(null); // 검색 모드 상태 (바 / 필터)
    const [movies, setMovies] = useState<Movie[]>([]); // 검색된 영화 목록 상태
    const [loading, setLoading] = useState<boolean>(false); // 로딩 상태
    const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지 상태
    const [searchQuery, setSearchQuery] = useState<string>(""); // 검색 쿼리 상태
    const [filters, setFilters] = useState({
        genre: "",
        rating: "",
        sort: "",
        country: "",
    }); // 필터 조건 상태
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null); // 선택된 영화 상태
    const [movieDetails, setMovieDetails] = useState<any | null>(null); // 영화 상세 정보 상태
    const [videoUrl, setVideoUrl] = useState<string | null>(null); // 영화 트레일러 URL 상태
    const [isFilterApplied, setIsFilterApplied] = useState(false); // 필터 적용 여부 상태
    const [showScrollToTop, setShowScrollToTop] = useState(false); // Scroll to top 버튼 표시 여부
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 모달 열기/닫기 상태

    const {wishlist, addToWishlist, removeFromWishlist} = usePreference(); // Wishlist 관련 로직 가져오기

    // 무한 스크롤을 위한 커스텀 훅 (isFetching 상태로 로딩 관리)
    const {isFetching} = useInfiniteScroll(async () => {
        // 검색 모드에 따른 영화 목록 추가 로드
        if (searchMode === "bar" && searchQuery) {
            const nextPage = currentPage + 1;
            const newMovies = await fetchMoviesBySearch(searchQuery, nextPage);
            setMovies((prev) => [...prev, ...newMovies]);
            setCurrentPage(nextPage);
        } else if (searchMode === "filter" && isFilterApplied) {
            const nextPage = currentPage + 1;
            const newMovies = await fetchMoviesByFilters({
                ...filters,
                page: nextPage,
            });
            setMovies((prev) => [...prev, ...newMovies]);
            setCurrentPage(nextPage);
        }
    });

    // 검색어로 영화 검색
    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        setLoading(true);
        const searchResults = await fetchMoviesBySearch(query, 1);
        setMovies(searchResults);
        setCurrentPage(1);
        setLoading(false);
    };

    // 필터 조건으로 영화 검색
    const handleFilterSearch = async () => {
        setIsFilterApplied(true);
        setLoading(true);
        const filteredMovies = await fetchMoviesByFilters({
            ...filters,
            page: 1,
        });
        setMovies(filteredMovies);
        setCurrentPage(1);
        setLoading(false);
    };

    // 필터 리셋
    const handleFilterReset = () => {
        setFilters({genre: "", rating: "", sort: "", country: ""});
        setIsFilterApplied(false);
        setMovies([]);
    };

    // 영화 클릭 시 상세 정보와 트레일러 URL 가져오기
    const handleMovieClick = async (movie: Movie) => {
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

    // 상단으로 스크롤
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // 영화가 찜 목록에 있는지 확인
    const isInWishlist = (movie: Movie) => {
        return wishlist.some((m) => m.id === movie.id);
    };

    // 찜 목록에 추가/제거
    const handleWishlistToggle = () => {
        if (selectedMovie) {
            isInWishlist(selectedMovie)
                ? removeFromWishlist(selectedMovie.id)
                : addToWishlist(selectedMovie);
        }
    };

    // 스크롤 이벤트로 "상단으로 가기" 버튼 표시 여부 결정
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

    // 검색 모드 선택 화면
    if (searchMode === null) {
        return (
            <div className="search-mode-selection">
                <h2>어떻게 검색하실래요?</h2>
                <div className="search-mode-buttons">
                    <button
                        className="mode-button"
                        onClick={() => setSearchMode("bar")}
                    >
                        직접 타이핑해서 검색
                    </button>
                    <button
                        className="mode-button"
                        onClick={() => setSearchMode("filter")}
                    >
                        필터를 이용한 검색
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="search-view">
            <h1 className="search-title">Search</h1>
            {searchMode === "bar" && <SearchBar onSearch={handleSearch}/>}
            {searchMode === "filter" && (
                <SearchFilter
                    filters={filters}
                    onFilterChange={setFilters}
                    onSearch={handleFilterSearch}
                    onReset={handleFilterReset}
                />
            )}
            <div className="movie-grid">
                {movies.map((movie) => (
                    <div key={movie.id} onClick={() => handleMovieClick(movie)}>
                        <MovieCard movie={movie}/>
                    </div>
                ))}
            </div>
            {loading && <p className="loading-text">로딩 중...</p>}
            {isFetching && <p className="loading-text">더 많은 데이터를 불러오는 중...</p>}

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

            {/* Scroll to Top 버튼 */}
            {showScrollToTop && (
                <button className="scroll-to-top" onClick={scrollToTop}>
                    ▲
                </button>
            )}
        </div>
    );
};

export default SearchView;