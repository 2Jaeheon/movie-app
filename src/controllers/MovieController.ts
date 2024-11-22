import tmdbAPI from "../services/api/tmdbAPI"; // TMDB API 호출을 위한 서비스
import Endpoints from "../services/api/EndPoints"; // API 엔드포인트를 정의한 모듈
import {Movie} from "../models/Movie"; // Movie 모델

// 다가오는 영화 목록 가져오기
export const fetchUpcomingMovies = async (): Promise<Movie[]> => {
    try {
        const response = await tmdbAPI.get(Endpoints.upcomingMovies, {
            params: {
                language: "ko-KR", // 한국어로 데이터를 요청
                page: 1, // 첫 번째 페이지 요청
            },
        });
        return response.data.results.slice(0, 10); // 상위 10개 영화만 반환
    } catch (error) {
        console.error("Failed to fetch upcoming movies", error); // 오류 발생 시 로그 출력
        return [];
    }
};

// 현재 상영 중인 영화 목록 가져오기
export const fetchNowPlayingMovies = async (): Promise<Movie[]> => {
    try {
        const response = await tmdbAPI.get(Endpoints.nowPlayingMovies, {
            params: {
                language: "ko-KR", // 한국어로 데이터를 요청
                page: 1, // 첫 번째 페이지 요청
            },
        });
        return response.data.results.slice(0, 20); // 상위 20개 영화만 반환
    } catch (error) {
        console.error("Failed to fetch now playing movies", error); // 오류 발생 시 로그 출력
        return [];
    }
};

// 인기 영화 목록 가져오기
export const fetchPopularMovies = async (): Promise<Movie[]> => {
    try {
        const allMovies: Movie[] = [];
        const totalPages = 5; // 최대 5 페이지 요청 (총 100개 영화)

        for (let page = 1; page <= totalPages; page++) {
            const response = await tmdbAPI.get(Endpoints.popularMovies, {
                params: {
                    language: "ko-KR", // 한국어로 데이터를 요청
                    page,
                },
            });
            allMovies.push(...response.data.results); // 각 페이지의 결과를 모은다
        }

        // 평점이 7.5 이상인 영화만 필터링
        const filteredMovies = allMovies.filter((movie: Movie) => movie.vote_average >= 7.5);
        return filteredMovies; // 필터링된 영화 목록 반환
    } catch (error) {
        console.error("Failed to fetch popular movies", error); // 오류 발생 시 로그 출력
        return [];
    }
};

// 트렌딩 영화 목록 가져오기
export const fetchTrendingMovies = async (): Promise<Movie[]> => {
    const response = await tmdbAPI.get(Endpoints.trendingMovies, {
        params: {
            language: "ko-KR", // 한국어로 데이터를 요청
        },
    });
    return response.data.results; // 트렌딩 영화 목록 반환
};

// 특정 영화의 비디오(예고편) 가져오기
export const fetchMovieVideos = async (movieId: number): Promise<string | null> => {
    try {
        const response = await tmdbAPI.get(`/movie/${movieId}/videos`, {
            params: {
                language: "en-US", // 영어로 데이터를 요청
            },
        });
        const videos = response.data.results;

        // 유튜브 예고편 필터링
        const trailer = videos.find((video: any) => video.site === "YouTube" && video.type === "Trailer");

        return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null; // 유튜브 링크 반환
    } catch (error) {
        console.error("Failed to fetch movie videos", error); // 오류 발생 시 로그 출력
        return null;
    }
};

// 특정 영화의 상세 정보 가져오기
export const fetchMovieDetails = async (movieId: number): Promise<any> => {
    try {
        const response = await tmdbAPI.get(`/movie/${movieId}`, {
            params: {
                language: "ko-KR", // 한국어로 데이터를 요청
                append_to_response: "credits", // 출연진 및 제작진 정보 포함
            },
        });
        return response.data; // 영화 상세 정보 반환
    } catch (error) {
        console.error("Failed to fetch movie details", error); // 오류 발생 시 로그 출력
        return null;
    }
};

// 인기 있는 액션 영화 (장르 ID: 28)
export const fetchActionMovies = async (): Promise<Movie[]> => {
    try {
        const response = await tmdbAPI.get(Endpoints.discoverMovies, {
            params: {
                with_genres: 28, // 액션 장르 ID
                sort_by: "popularity.desc", // 인기도 기준으로 정렬
                "vote_count.gte": 1000, // 최소 1000표 이상
                language: "ko-KR", // 한국어로 데이터를 요청
                page: 1, // 첫 번째 페이지 요청
            },
        });
        return response.data.results.slice(0, 20); // 상위 20개 영화만 반환
    } catch (error) {
        console.error("Failed to fetch action movies", error); // 오류 발생 시 로그 출력
        return [];
    }
};

// 인기 있는 로맨스 영화 (장르 ID: 10749)
export const fetchRomanceMovies = async (): Promise<Movie[]> => {
    try {
        const response = await tmdbAPI.get(Endpoints.discoverMovies, {
            params: {
                with_genres: 10749, // 로맨스 장르 ID
                sort_by: "popularity.desc", // 인기도 기준으로 정렬
                "vote_count.gte": 500, // 최소 500표 이상
                language: "ko-KR", // 한국어로 데이터를 요청
                page: 1, // 첫 번째 페이지 요청
            },
        });
        return response.data.results.slice(0, 20); // 상위 20개 영화만 반환
    } catch (error) {
        console.error("Failed to fetch romance movies", error); // 오류 발생 시 로그 출력
        return [];
    }
};

// 인기 있는 드라마 영화 (장르 ID: 18)
export const fetchDramaMovies = async (): Promise<Movie[]> => {
    try {
        const response = await tmdbAPI.get(Endpoints.discoverMovies, {
            params: {
                with_genres: 18, // 드라마 장르 ID
                sort_by: "popularity.desc", // 인기도 기준으로 정렬
                "vote_count.gte": 500, // 최소 500표 이상
                language: "ko-KR", // 한국어로 데이터를 요청
                page: 1, // 첫 번째 페이지 요청
            },
        });
        return response.data.results.slice(0, 20); // 상위 20개 영화만 반환
    } catch (error) {
        console.error("Failed to fetch drama movies", error); // 오류 발생 시 로그 출력
        return [];
    }
};

// 오래된 고전 명작 (1980년 이전)
export const fetchClassicMovies = async (): Promise<Movie[]> => {
    try {
        const response = await tmdbAPI.get(Endpoints.discoverMovies, {
            params: {
                "primary_release_date.lte": "1980-12-31", // 1980년 12월 31일 이전
                sort_by: "vote_average.desc", // 높은 평점 순
                "vote_count.gte": 200, // 최소 200표 이상
                language: "ko-KR", // 한국어로 데이터를 요청
                page: 1, // 첫 번째 페이지 요청
            },
        });
        return response.data.results.slice(0, 20); // 상위 20개 영화만 반환
    } catch (error) {
        console.error("Failed to fetch classic movies", error); // 오류 발생 시 로그 출력
        return [];
    }
};

// 인기 영화 목록 (페이지네이션)
export const fetchPopularMoviesPaginated = async (page: number): Promise<Movie[]> => {
    try {
        const response = await tmdbAPI.get(Endpoints.popularMovies, {
            params: {
                language: "ko-KR", // 한국어로 데이터를 요청
                page, // 페이지 번호 전달
            },
        });
        return response.data.results.slice(0, 16); // 해당 페이지의 영화 데이터 반환
    } catch (error) {
        console.error(`Failed to fetch movies for page ${page}:`, error); // 오류 발생 시 로그 출력
        return [];
    }
};

// 인기 영화 목록 (무한 스크롤)
export const fetchPopularMoviesInfinite = async (page: number): Promise<Movie[]> => {
    try {
        const response = await tmdbAPI.get(Endpoints.popularMovies, {
            params: {
                language: "ko-KR", // 한국어로 데이터를 요청
                page, // 페이지 번호 전달
            },
        });
        return response.data.results; // 해당 페이지의 영화 데이터 반환
    } catch (error) {
        console.error(`Failed to fetch movies for page ${page}:`, error); // 오류 발생 시 로그 출력
        return [];
    }
};

// 영화 검색
export const fetchMoviesBySearch = async (query: string, page: number): Promise<Movie[]> => {
    try {
        const response = await tmdbAPI.get("/search/movie", {
            params: {query, page, language: "ko-KR"}, // 검색어 및 페이지 번호 전달
        });
        return response.data.results; // 검색 결과 반환
    } catch (error) {
        console.error("Failed to fetch search results:", error); // 오류 발생 시 로그 출력
        return [];
    }
};

// 필터링된 영화 목록
export const fetchMoviesByFilters = async (filters: {
    genre: string;
    rating: string;
    sort: string;
    country?: string; // 국가 필터 추가
    page: number;
}): Promise<Movie[]> => {
    try {
        const {genre, rating, sort, country, page} = filters;
        const response = await tmdbAPI.get("/discover/movie", {
            params: {
                with_genres: genre, // 장르 필터
                "vote_average.gte": rating, // 평점 필터
                sort_by: sort, // 정렬 기준
                with_original_language: country, // 국가 필터
                page, // 페이지 번호
                language: "ko-KR", // 한국어로 데이터를 요청
            },
        });
        return response.data.results; // 필터링된 영화 목록 반환
    } catch (error) {
        console.error("Failed to fetch filtered movies:", error); // 오류 발생 시 로그 출력
        return [];
    }
};