import React, {useState, useEffect} from "react";
import {Link, useLocation} from "react-router-dom";
import "./Header.css";

interface HeaderProps {
    isLoggedIn: boolean;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({isLoggedIn, onLogout}) => {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrollingUp, setIsScrollingUp] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(window.scrollY);

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
                setIsScrollingUp(false); // Scrolling down, hide header
            } else {
                setIsScrollingUp(true); // Scrolling up, show header
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollY]);

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
                <button
                    className="logout-button"
                    onClick={() => {
                        onLogout();
                        closeMenu();
                    }}
                >
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