import axios from "axios";

/**
 * 로컬스토리지에 저장된 카카오 accessToken의 유효성을 검사합니다.
 * @returns {Promise<boolean>} 유효하면 true, 유효하지 않으면 false 반환
 */
export const isKakaoTokenValid = async (): Promise<boolean> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            console.error("Access token not found.");
            return false;
        }

        // 카카오 토큰 정보 확인 API 호출
        const response = await axios.get("https://kapi.kakao.com/v1/user/access_token_info", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // 토큰 유효성 체크
        if (response.status === 200) {
            return true; // 유효한 토큰
        }

        return false; // 유효하지 않음
    } catch (error: any) {
        console.error("Error validating access token:", error.message || error);
        return false; // 유효하지 않은 경우
    }
};