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
    const [searchMode, setSearchMode] = useState<"bar" | "filter" | null>(null);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filters, setFilters] = useState({
        genre: "",
        rating: "",
        sort: "",
        country: "",
    });
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [movieDetails, setMovieDetails] = useState<any | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [showScrollToTop, setShowScrollToTop] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const {wishlist, addToWishlist, removeFromWishlist} = usePreference(); // Wishlist 관련 로직 가져오기

    const {isFetching} = useInfiniteScroll(async () => {
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

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        setLoading(true);
        const searchResults = await fetchMoviesBySearch(query, 1);
        setMovies(searchResults);
        setCurrentPage(1);
        setLoading(false);
    };

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

    const handleFilterReset = () => {
        setFilters({genre: "", rating: "", sort: "", country: ""});
        setIsFilterApplied(false);
        setMovies([]);
    };

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

    if (searchMode === null) {
        return (
            <div className="search-mode-selection">
                <h2>검색을 어떻게 진행하시겠습니까?</h2>
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
            <h1 className="search-title">검색 페이지</h1>
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

            {showScrollToTop && (
                <button className="scroll-to-top" onClick={scrollToTop}>
                    ▲
                </button>
            )}
        </div>
    );
};

export default SearchView;