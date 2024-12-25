import React, {useEffect, useState, useCallback} from "react";
import {useNavigate} from "react-router-dom";
import "./AuthView.css";

const Toast: React.FC<{ message: string; onClose: () => void }> = ({message, onClose}) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                backgroundColor: "#333",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "5px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
            }}
        >
            {message}
        </div>
    );
};

interface KakaoAuthResponse {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    refresh_token_expires_in: number;
}

interface KakaoUserInfo {
    id: number;
    connected_at: string;
    properties: {
        nickname: string;
        profile_image?: string;
        thumbnail_image?: string;
    };
    kakao_account: {
        profile_nickname_needs_agreement: boolean;
        profile_image_needs_agreement: boolean;
        profile: {
            nickname: string;
            thumbnail_image_url?: string;
            profile_image_url?: string;
            is_default_image: boolean;
        };
        has_email: boolean;
        email_needs_agreement: boolean;
        is_email_valid: boolean;
        is_email_verified: boolean;
        email: string;
    };
}

interface SignInProps {
    onLogin: () => void;
}

const SignIn: React.FC<SignInProps> = ({onLogin}) => {
    const [userInfo, setUserInfo] = useState<KakaoUserInfo | null>(null);
    const [isWelcomeVisible, setIsWelcomeVisible] = useState(false);
    const [isTokenFetched, setIsTokenFetched] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
    const REDIRECT_URI = process.env.REACT_APP_LOGIN_REDRIRECT_URI;
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    const getUserInfo = useCallback(async (accessToken: string) => {
        const userInfoUrl = "https://kapi.kakao.com/v2/user/me";

        try {
            const response = await fetch(userInfoUrl, {
                headers: {Authorization: `Bearer ${accessToken}`},
            });

            if (!response.ok) throw new Error("Failed to get user info");

            const userData: KakaoUserInfo = await response.json();
            setUserInfo(userData);

            setIsWelcomeVisible(true);
            localStorage.setItem("accessToken", accessToken);

            onLogin();

            setTimeout(() => {
                setIsWelcomeVisible(false);
                navigate("/movie-app");
            }, 2000);
        } catch (error: any) {
            setErrorMessage(error.message || "Error getting user info");
        }
    }, [onLogin, navigate]);

    const getToken = useCallback(
        async (code: string) => {
            const tokenUrl = "https://kauth.kakao.com/oauth/token";
            const data: Record<string, string> = {
                grant_type: "authorization_code",
                client_id: REST_API_KEY || "",
                redirect_uri: REDIRECT_URI || "",
                code,
            };

            try {
                const response = await fetch(tokenUrl, {
                    method: "POST",
                    headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
                    body: new URLSearchParams(data).toString(),
                });

                if (!response.ok) throw new Error("Failed to get token");

                const tokenData: KakaoAuthResponse = await response.json();
                await getUserInfo(tokenData.access_token);
            } catch (error: any) {
                setErrorMessage(error.message || "Error getting token");
            }
        },
        [REST_API_KEY, REDIRECT_URI, getUserInfo]
    );

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get("code");
        if (code && !isTokenFetched) {
            setIsTokenFetched(true);
            getToken(code);
            const newUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
    }, [isTokenFetched, getToken]);

    const handleLogin = () => {
        window.location.href = KAKAO_AUTH_URL;
    };

    return (
        <div className="auth-background">
            <div className="auth-card-container">
                <div className="auth-card front">
                    {isWelcomeVisible ? (
                        <div>
                            <h1 className="auth-title">Welcome, {userInfo?.properties?.nickname}!</h1>
                            {userInfo?.properties?.profile_image && (
                                <img
                                    src={userInfo.properties.profile_image}
                                    width="120"
                                    height="120"
                                    alt="Profile"
                                    style={{borderRadius: "50%", marginTop: "1rem"}}
                                />
                            )}
                            <p style={{marginTop: "1rem", fontSize: "1.1rem", color: "#333"}}>
                                2초 후 페이지로 이동합니다...
                            </p>
                        </div>
                    ) : (
                        <>
                            <h1 className="auth-title">Welcome to Our Service!</h1>
                            {userInfo ? (
                                <div>
                                    <p id="welcome-name">Welcome, {userInfo.properties?.nickname || "User"}!</p>
                                    {userInfo.properties?.profile_image && (
                                        <img
                                            src={userInfo.properties.profile_image}
                                            width="100"
                                            height="100"
                                            alt="Profile"
                                        />
                                    )}
                                    <p>Email: {userInfo.kakao_account?.email || "Not Provided"}</p>
                                </div>
                            ) : (
                                <button className="auth-button" onClick={handleLogin}>
                                    Login with Kakao
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
            {errorMessage && (
                <Toast
                    message={errorMessage}
                    onClose={() => setErrorMessage(null)}
                />
            )}
        </div>
    );
};

export default SignIn;