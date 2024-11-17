import axios from "axios";

const tmdbAPI = axios.create({
    baseURL: "https://api.themoviedb.org/3", // TMDB API 기본 URL
    headers: {
        "Content-Type": "application/json",
    },
});

// 요청 인터셉터: API 키 추가
tmdbAPI.interceptors.request.use((config) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const currentUser = users.find(
        (u: { email: string }) => u.email === localStorage.getItem("currentUserEmail")
    );

    if (currentUser) {
        config.params = {
            ...config.params,
            api_key: currentUser.password, // 로컬 스토리지에 저장된 API 키 사용
        };
    }

    return config;
});

export default tmdbAPI;