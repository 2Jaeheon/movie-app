import axios from "axios";
import {isKakaoTokenValid} from "../../util/kakaoAuth"; // 카카오 토큰 유효성 검사 함수 가져오기

// tmdbAPI 인스턴스 생성
const tmdbAPI = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {
        "Content-Type": "application/json",
    },
});

// 요청 인터셉터 추가
tmdbAPI.interceptors.request.use(async (config) => {
    const apiKey = process.env.REACT_APP_TMDB_API_KEY;

    if (!apiKey) {
        throw new Error("API key is missing. Please set REACT_APP_TMDB_API_KEY in your environment variables.");
    }

    // API 키 추가
    config.params = {
        ...config.params,
        api_key: apiKey,
    };

    // 카카오 토큰 유효성 검사
    const tokenValid = await isKakaoTokenValid();
    if (!tokenValid) {
        throw new Error("Invalid or expired Kakao access token. Please re-authenticate.");
    }

    return config; // 요청 전송
});

export default tmdbAPI;