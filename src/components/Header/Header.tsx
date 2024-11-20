import React, {useState} from "react";
import {Link, useLocation} from "react-router-dom";
import "./Header.css";

interface HeaderProps {
    isLoggedIn: boolean; // 로그인 여부
    onLogout: () => void; // 로그아웃 이벤트 핸들러
}

const Header: React.FC<HeaderProps> = ({isLoggedIn, onLogout}) => {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const guestMenu = (
        <>
            <li>
                <Link
                    to="/signin"
                    className={location.pathname === "/signin" ? "active" : ""}
                    onClick={closeMenu} // 메뉴 닫기
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
                    to="/"
                    className={location.pathname === "/" ? "active" : ""}
                    onClick={closeMenu} // 메뉴 닫기
                >
                    Home
                </Link>
            </li>
            <li>
                <Link
                    to="/popular"
                    className={location.pathname === "/popular" ? "active" : ""}
                    onClick={closeMenu} // 메뉴 닫기
                >
                    Popular
                </Link>
            </li>
            <li>
                <Link
                    to="/search"
                    className={location.pathname === "/search" ? "active" : ""}
                    onClick={closeMenu} // 메뉴 닫기
                >
                    Search
                </Link>
            </li>
            <li>
                <Link
                    to="/wishlist"
                    className={location.pathname === "/wishlist" ? "active" : ""}
                    onClick={closeMenu} // 메뉴 닫기
                >
                    Wishlist
                </Link>
            </li>
            <li>
                <button
                    className="logout-button"
                    onClick={() => {
                        onLogout();
                        closeMenu(); // 로그아웃 후 메뉴 닫기
                    }}
                >
                    Logout
                </button>
            </li>
        </>
    );

    return (
        <header className="header">
            <div className="logo">
                <Link to="/" onClick={closeMenu}>
                    🎬 Short Movies
                </Link>
            </div>
            <div className="hamburger" onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <nav className={`nav-menu ${menuOpen ? "active" : ""}`}>
                <ul>{isLoggedIn ? userMenu : guestMenu}</ul>
            </nav>
        </header>
    );
};

export default Header;