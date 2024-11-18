import React from "react";
import "./SearchFilter.css";

interface SearchFilterProps {
    filters: { genre: string; rating: string; sort: string; country: string };
    onFilterChange: (filters: { genre: string; rating: string; sort: string; country: string }) => void;
    onSearch: () => void;
    onReset: () => void;
}

// 장르 목록 추가
const genres = [
    {id: "", name: "모든 장르"},
    {id: "28", name: "액션"},
    {id: "12", name: "모험"},
    {id: "16", name: "애니메이션"},
    {id: "35", name: "코미디"},
    {id: "80", name: "범죄"},
    {id: "99", name: "다큐멘터리"},
    {id: "18", name: "드라마"},
    {id: "10751", name: "가족"},
    {id: "14", name: "판타지"},
    {id: "36", name: "역사"},
    {id: "27", name: "공포"},
    {id: "10402", name: "음악"},
    {id: "9648", name: "미스터리"},
    {id: "10749", name: "로맨스"},
    {id: "878", name: "SF"},
    {id: "10770", name: "TV 영화"},
    {id: "53", name: "스릴러"},
    {id: "10752", name: "전쟁"},
    {id: "37", name: "서부극"},
];

// 국가 목록 추가
const countries = [
    {id: "", name: "모든 국가"},
    {id: "ko", name: "한국"},
    {id: "ja", name: "일본"},
    {id: "zh", name: "중국"},
    {id: "en", name: "미국"},
    {id: "ru", name: "러시아"},
];

const SearchFilter: React.FC<SearchFilterProps> = ({filters, onFilterChange, onSearch, onReset}) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        onFilterChange({...filters, [name]: value});
    };

    return (
        <div className="search-filter">
            <div className="filter-grid">
                <div className="filter-group">
                    <label htmlFor="genre">장르</label>
                    <select
                        id="genre"
                        name="genre"
                        value={filters.genre}
                        onChange={handleInputChange}
                    >
                        {genres.map((genre) => (
                            <option key={genre.id} value={genre.id}>
                                {genre.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="rating">평점</label>
                    <select
                        id="rating"
                        name="rating"
                        value={filters.rating}
                        onChange={handleInputChange}
                    >
                        <option value="">모든 평점</option>
                        <option value="8">8점 이상</option>
                        <option value="7">7점 이상</option>
                        <option value="6">6점 이상</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="sort">정렬</label>
                    <select
                        id="sort"
                        name="sort"
                        value={filters.sort}
                        onChange={handleInputChange}
                    >
                        <option value="">기본</option>
                        <option value="popularity.desc">인기순</option>
                        <option value="release_date.desc">최신순</option>
                        <option value="vote_average.desc">평점순</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="country">국가</label>
                    <select
                        id="country"
                        name="country"
                        value={filters.country}
                        onChange={handleInputChange}
                    >
                        {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="filter-actions">
                <button className="search-button" onClick={onSearch}>
                    검색
                </button>
                <button className="reset-button" onClick={onReset}>
                    초기화
                </button>
            </div>
        </div>
    );
};

export default SearchFilter;