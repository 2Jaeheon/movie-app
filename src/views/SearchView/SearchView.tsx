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
import Modal from "../../components/common/Modal";
import MovieCard from "../../components/MovieCard/MovieCard";
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
        country: "", // 국가 필터 추가
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [movieDetails, setMovieDetails] = useState<any | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isFilterApplied, setIsFilterApplied] = useState(false);

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
        setFilters({genre: "", rating: "", sort: "", country: ""}); // 국가 필터 초기화 포함
        setIsFilterApplied(false);
        setMovies([]);
    };

    const handleMovieClick = async (movie: Movie) => {
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

    const [showScrollToTop, setShowScrollToTop] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
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

            {isModalOpen && selectedMovie && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={selectedMovie.title}
                >
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
                                <p>
                                    <strong>Overview:</strong>{" "}
                                    {movieDetails.overview}
                                </p>
                                <p>
                                    <strong>Release Date:</strong>{" "}
                                    {movieDetails.release_date}
                                </p>
                                <p>
                                    <strong>Rating:</strong> ⭐{" "}
                                    {movieDetails.vote_average}
                                </p>
                                <p>
                                    <strong>Director:</strong>{" "}
                                    {movieDetails.credits?.crew?.find(
                                        (crew: any) => crew.job === "Director"
                                    )?.name}
                                </p>
                                <p>
                                    <strong>Cast:</strong>{" "}
                                    {movieDetails.credits?.cast
                                        ?.slice(0, 5)
                                        .map((actor: any) => actor.name)
                                        .join(", ")}
                                </p>
                                <p>
                                    <strong>Genres:</strong>{" "}
                                    {movieDetails.genres
                                        ?.map((genre: any) => genre.name)
                                        .join(", ")}
                                </p>
                                <div className="modal-actions">
                                    <button
                                        className="modal-button close"
                                        onClick={handleCloseModal}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="modal-button action"
                                        onClick={() =>
                                            alert("Action! Wishlist 추가")
                                        }
                                    >
                                        Add to Wishlist
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </Modal>
            )}

            {showScrollToTop && (
                <button className="scroll-to-top" onClick={scrollToTop}>
                    ▲
                </button>
            )}
        </div>
    );
};

export default SearchView;