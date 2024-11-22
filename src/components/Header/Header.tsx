import React, {useState, useEffect} from "react";
import {Link, useLocation} from "react-router-dom";
import "./Header.css";

interface HeaderProps {
    isLoggedIn: boolean; // 로그인 상태
    onLogout: () => void; // 로그아웃 함수
}

const Header: React.FC<HeaderProps> = ({isLoggedIn, onLogout}) => {
    const location = useLocation(); // 현재 URL 경로 가져오기
    const [menuOpen, setMenuOpen] = useState(false); // 메뉴 열림 상태
    const [isScrollingUp, setIsScrollingUp] = useState(true); // 스크롤 방향 상태 (위로 스크롤 중인지 확인)
    const [lastScrollY, setLastScrollY] = useState(window.scrollY); // 마지막 스크롤 위치

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev); // 메뉴 열기/닫기 토글
    };

    const closeMenu = () => {
        setMenuOpen(false); // 메뉴 닫기
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY; // 현재 스크롤 위치

            // 스크롤 방향에 따라 헤더 표시 여부 결정
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsScrollingUp(false); // 아래로 스크롤, 헤더 숨기기
            } else {
                setIsScrollingUp(true); // 위로 스크롤, 헤더 표시
            }

            setLastScrollY(currentScrollY); // 마지막 스크롤 위치 갱신
        };

        window.addEventListener("scroll", handleScroll); // 스크롤 이벤트 리스너 추가
        return () => {
            window.removeEventListener("scroll", handleScroll); // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        };
    }, [lastScrollY]); // 마지막 스크롤 위치가 변경될 때마다 실행

    // 로그인하지 않은 사용자 메뉴
    const guestMenu = (
        <>
            <li>
                <Link
                    to="/movie-app/signin"
                    className={location.pathname === "/movie-app/signin" ? "active" : ""}
                    onClick={closeMenu} // 메뉴 클릭 시 메뉴 닫기
                >
                    Sign In
                </Link>
            </li>
        </>
    );

    // 로그인한 사용자 메뉴
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
                <button
                    className="logout-button"
                    onClick={() => {
                        onLogout(); // 로그아웃 함수 호출
                        closeMenu(); // 메뉴 닫기
                    }}
                >
                    Logout
                </button>
            </li>
        </>
    );

    return (
        <header className={`header ${isScrollingUp ? "visible" : "hidden"}`}>
            {/* 스크롤에 따라 헤더의 visibility 클래스 변경 */}
            <div className="logo">
                <Link to="/movie-app/" onClick={closeMenu}>
                    🎬 Short Movies
                </Link>
            </div>
            <div className="hamburger" onClick={toggleMenu}>
                {/* 햄버거 메뉴 아이콘 클릭 시 메뉴 열기/닫기 */}
                <span></span>
                <span></span>
                <span></span>
            </div>
            <nav className={`nav-menu ${menuOpen ? "active" : ""}`}>
                {/* 메뉴가 열리면 active 클래스 추가 */}
                <ul>{isLoggedIn ? userMenu : guestMenu}</ul>
            </nav>
        </header>
    );
};

export default Header;