import React from "react";
import {Link, useLocation} from "react-router-dom";
import "./Header.css";

interface HeaderProps {
    isLoggedIn: boolean; // 로그인 여부
    onLogout: () => void; // 로그아웃 이벤트 핸들러
}

const Header: React.FC<HeaderProps> = ({isLoggedIn, onLogout}) => {
    const location = useLocation();

    const guestMenu = (
        <>
            <li>
                <Link to="/signin" className={location.pathname === "/signin" ? "active" : ""}>
                    Sign In
                </Link>
            </li>
        </>
    );

    const userMenu = (
        <>
            <li>
                <Link to="/" className={location.pathname === "/" ? "active" : ""}>
                    Home
                </Link>
            </li>
            <li>
                <Link to="/popular" className={location.pathname === "/popular" ? "active" : ""}>
                    Popular
                </Link>
            </li>
            <li>
                <Link to="/search" className={location.pathname === "/search" ? "active" : ""}>
                    Search
                </Link>
            </li>
            <li>
                <Link to="/wishlist" className={location.pathname === "/wishlist" ? "active" : ""}>
                    Wishlist
                </Link>
            </li>
            <li>
                <button className="logout-button" onClick={onLogout}>
                    Logout
                </button>
            </li>
        </>
    );

    return (
        <header className="header">
            <div className="logo">
                <Link to="/">🎬 CineFlow</Link>
            </div>
            <nav className="nav-menu">
                <ul>{isLoggedIn ? userMenu : guestMenu}</ul>
            </nav>
        </header>
    );
};

export default Header;