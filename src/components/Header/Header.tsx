import React, {useState, useEffect} from "react";
import {Link, useLocation} from "react-router-dom";
import {isKakaoTokenValid} from "../../util/kakaoAuth"; // 카카오 토큰 유효성 검사 함수 가져오기
import "./Header.css";

// Toast 컴포넌트
const Toast: React.FC<{ message: string; onClose: () => void }> = ({message, onClose}) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 2000); // 3초 후 자동 닫힘
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div style={{
            position: "fixed",
            backgroundColor: "#333",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "5px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
        }}>
            {message}
        </div>
    );
};

interface HeaderProps {
    isLoggedIn: boolean;
    onLogout: () => Promise<void>;
}

const Header: React.FC<HeaderProps> = ({isLoggedIn, onLogout}) => {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrollingUp, setIsScrollingUp] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(window.scrollY);
    const [nickname, setNickname] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // 에러 메시지 상태

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsScrollingUp(false);
            } else {
                setIsScrollingUp(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollY]);

    useEffect(() => {
        const fetchNickname = async () => {
            if (!isLoggedIn) return;

            try {
                const accessToken = localStorage.getItem("accessToken");
                if (!accessToken) throw new Error("Access token not found");

                const response = await fetch("https://kapi.kakao.com/v2/user/me", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user info");
                }

                const userInfo = await response.json();
                setNickname(userInfo.properties.nickname);
            } catch (error: any) {
                setErrorMessage(error.message || "Failed to fetch nickname");
                setNickname(null);
            }
        };

        fetchNickname();
    }, [isLoggedIn]);

    const handleLogout = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");

            if (!accessToken) {
                window.location.reload();
                return;
            }

            // 토큰 유효성 검사
            const tokenValid = await isKakaoTokenValid();

            if (!tokenValid) {
                // 토큰이 유효하지 않으면 토큰 제거 및 로그인 페이지로 이동
                localStorage.removeItem("accessToken");
                window.location.reload();
                return;
            }

            // 토큰이 유효한 경우 기존 로그아웃 로직 수행
            const response = await fetch("https://kapi.kakao.com/v1/user/logout", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("카카오 로그아웃 실패. 다시 시도해주세요.");
            }

            // 카카오 계정 로그아웃 URL 설정
            const clientId = process.env.REACT_APP_KAKAO_REST_API_KEY;
            const redirectUri = encodeURIComponent(process.env.REACT_APP_LOGOUT_REDIRECT_URI || "");
            const kakaoAccountLogoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=${clientId}&logout_redirect_uri=${redirectUri}`;

            // onLogout 호출 및 카카오 계정 로그아웃 처리
            await onLogout();
            window.location.href = kakaoAccountLogoutUrl;

            // 로컬 스토리지에서 토큰 제거
            localStorage.removeItem("accessToken");
        } catch (error: any) {
            // 에러 메시지 표시
            setErrorMessage(error.message || "로그아웃 중 오류 발생");
        }
    };

    const guestMenu = (
        <>
            <li>
                <Link
                    to="/movie-app/signin"
                    className={location.pathname === "/movie-app/signin" ? "active" : ""}
                    onClick={closeMenu}
                >
                    Sign In
                </Link>
            </li>
        </>
    );

    const userMenu = (
        <>
            <li>
                <Link
                    to="/movie-app/"
                    className={location.pathname === "/movie-app/" ? "active" : ""}
                    onClick={closeMenu}
                >
                    Home
                </Link>
            </li>
            <li>
                <Link
                    to="/movie-app/popular"
                    className={location.pathname === "/movie-app/popular" ? "active" : ""}
                    onClick={closeMenu}
                >
                    Popular
                </Link>
            </li>
            <li>
                <Link
                    to="/movie-app/search"
                    className={location.pathname === "/movie-app/search" ? "active" : ""}
                    onClick={closeMenu}
                >
                    Search
                </Link>
            </li>
            <li>
                <Link
                    to="/movie-app/wishlist"
                    className={location.pathname === "/movie-app/wishlist" ? "active" : ""}
                    onClick={closeMenu}
                >
                    Wishlist
                </Link>
            </li>
            <li>
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </li>
        </>
    );

    return (
        <header className={`header ${isScrollingUp ? "visible" : "hidden"}`}>
            <div className="logo">
                <Link to="/movie-app/" onClick={closeMenu}>
                    🎬 Short Movies
                </Link>
                {nickname && <span className="welcome-message"> Welcome, {nickname}!</span>}
            </div>
            <div className="hamburger" onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <nav className={`nav-menu ${menuOpen ? "active" : ""}`}>
                <ul>{isLoggedIn ? userMenu : guestMenu}</ul>
            </nav>
            {errorMessage && (
                <Toast
                    message={errorMessage}
                    onClose={() => setErrorMessage(null)} // 토스트 닫기
                />
            )}
        </header>
    );
};

export default Header;