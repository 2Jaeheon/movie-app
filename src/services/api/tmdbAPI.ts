import axios from "axios"; // axios 라이브러리 임포트

// tmdbAPI 인스턴스를 생성하여 TMDB API와 통신할 준비를 합니다.
const tmdbAPI = axios.create({
    baseURL: "https://api.themoviedb.org/3", // TMDB API 기본 URL
    headers: {
        "Content-Type": "application/json", // 요청의 기본 Content-Type을 JSON으로 설정
    },
});

// 요청 인터셉터: API 요청 시 자동으로 API 키를 추가하는 역할
tmdbAPI.interceptors.request.use((config) => {
    // 로컬 스토리지에서 "users" 데이터를 가져옵니다.
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // 로컬 스토리지에서 "currentUserEmail"에 해당하는 사용자를 찾습니다.
    const currentUser = users.find(
        (u: { email: string }) => u.email === localStorage.getItem("currentUserEmail")
    );

    // 사용자가 존재하면 API 키를 요청 파라미터에 추가합니다.
    if (currentUser) {
        config.params = {
            ...config.params,
            api_key: currentUser.password, // 로컬 스토리지에 저장된 API 키 사용
        };
    }

    return config; // 수정된 요청 객체를 반환하여 API 요청을 보냅니다.
});

export default tmdbAPI; // tmdbAPI 인스턴스를 외부에서 사용할 수 있도록 내보냅니다.