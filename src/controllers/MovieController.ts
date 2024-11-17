import tmdbAPI from "../services/api/tmdbAPI";
import Endpoints from "../services/api/EndPoints";
import {Movie} from "../models/Movie";

export const fetchPopularMovies = async (): Promise<Movie[]> => {
    const response = await tmdbAPI.get(Endpoints.popularMovies, {
        params: {
            language: "ko-KR",
            page: 1,
        },
    });
    return response.data.results;
};

export const fetchTrendingMovies = async (): Promise<Movie[]> => {
    const response = await tmdbAPI.get(Endpoints.trendingMovies, {
        params: {
            language: "ko-KR",
        },
    });
    return response.data.results;
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
    const response = await tmdbAPI.get(Endpoints.searchMovies, {
        params: {
            query,
            language: "ko-KR",
            page: 1,
        },
    });
    return response.data.results;
};