import tmdbAPI from "../services/api/tmdbAPI";
import Endpoints from "../services/api/EndPoints";
import {Movie} from "../models/Movie";


// 곧 출시될 영화
export const fetchUpcomingMovies = async (): Promise<Movie[]> => {
    try {
        const response = await tmdbAPI.get(Endpoints.upcomingMovies, {
            params: {
                language: "ko-KR",
                page: 1,
            },
        });
        return response.data.results.slice(0, 10); // 상위 20개 영화만 반환
    } catch (error) {
        console.error("Failed to fetch upcoming movies", error);
        return [];
    }
};

export const fetchNowPlayingMovies = async (): Promise<Movie[]> => {
    try {
        const response = await tmdbAPI.get(Endpoints.nowPlayingMovies, {
            params: {
                language: "ko-KR",
                page: 1,
            },
        });
        return response.data.results.slice(0, 20); // 상위 20개 영화만 반환
    } catch (error) {
        console.error("Failed to fetch now playing movies", error);
        return [];
    }
};

export const fetchPopularMovies = async (): Promise<Movie[]> => {
    try {
        const allMovies: Movie[] = [];
        const totalPages = 5; // 페이지 수를 설정하여 최대 100개의 영화 가져오기 (페이지당 20개 영화)

        for (let page = 1; page <= totalPages; page++) {
            const response = await tmdbAPI.get(Endpoints.popularMovies, {
                params: {
                    language: "ko-KR",
                    page,
                },
            });

            // 페이지에서 가져온 영화 데이터를 allMovies 배열에 추가
            allMovies.push(...response.data.results);
        }

        // 평점이 8 이상인 영화 필터링
        const filteredMovies = allMovies.filter((movie: Movie) => movie.vote_average >= 7.5);

        return filteredMovies; // 필터링된 영화 반환
    } catch (error) {
        console.error("Failed to fetch popular movies", error);
        return [];
    }
};

export const fetchTrendingMovies = async (): Promise<Movie[]> => {
    const response = await tmdbAPI.get(Endpoints.trendingMovies, {
        params: {
            language: "ko-KR",
        },
    });
    return response.data.results;
};

export const fetchMovieVideos = async (movieId: number): Promise<string | null> => {
    try {
        const response = await tmdbAPI.get(`/movie/${movieId}/videos`, {
            params: {
                language: "en-US",
            },
        });
        const videos = response.data.results;

        // 유튜브 트레일러 데이터만 필터링
        const trailer = videos.find((video: any) => video.site === "YouTube" && video.type === "Trailer");

        return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
    } catch (error) {
        console.error("Failed to fetch movie videos", error);
        return null;
    }
};

// 특정 영화의 상세 정보 가져오기
export const fetchMovieDetails = async (movieId: number): Promise<any> => {
    try {
        const response = await tmdbAPI.get(`/movie/${movieId}`, {
            params: {
                language: "ko-KR",
                append_to_response: "credits", // 출연진 및 제작진 정보 포함
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch movie details", error);
        return null;
    }
};

// 요즘 인기 있는 액션 영화 (장르 ID: 28)
export const fetchActionMovies = async (): Promise<Movie[]> => {
    try {
        const response = await tmdbAPI.get(Endpoints.discoverMovies, {
            params: {
                with_genres: 28, // 액션 장르 ID
                sort_by: "popularity.desc", // 인기도 기준으로 정렬
                "vote_count.gte": 1000, // 최소 1000표 이상
                language: "ko-KR",
                page: 1,
            },
        });
        return response.data.results.slice(0, 20); // 상위 20개 영화만 반환
    } catch (error) {
        console.error("Failed to fetch action movies", error);
        return [];
    }
};

// 요즘 인기 있는 로맨스 영화 (장르 ID: 10749)
export const fetchRomanceMovies = async (): Promise<Movie[]> => {
    try {
        const response = await tmdbAPI.get(Endpoints.discoverMovies, {
            params: {
                with_genres: 10749, // 로맨스 장르 ID
                sort_by: "popularity.desc",
                "vote_count.gte": 500,
                language: "ko-KR",
                page: 1,
            },
        });
        return response.data.results.slice(0, 20); // 상위 20개 영화만 반환
    } catch (error) {
        console.error("Failed to fetch romance movies", error);
        return [];
    }
};

// 요즘 인기 있는 드라마 영화 (장르 ID: 18)
export const fetchDramaMovies = async (): Promise<Movie[]> => {
    try {
        const response = await tmdbAPI.get(Endpoints.discoverMovies, {
            params: {
                with_genres: 18, // 드라마 장르 ID
                sort_by: "popularity.desc",
                "vote_count.gte": 500,
                language: "ko-KR",
                page: 1,
            },
        });
        return response.data.results.slice(0, 20); // 상위 20개 영화만 반환
    } catch (error) {
        console.error("Failed to fetch drama movies", error);
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
                language: "ko-KR",
                page: 1,
            },
        });
        return response.data.results.slice(0, 20);
    } catch (error) {
        console.error("Failed to fetch classic movies", error);
        return [];
    }
};