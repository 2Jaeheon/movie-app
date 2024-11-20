import React, {useState} from "react";
import {BrowserRouter as Router, Routes, Route, Navigate, useLocation} from "react-router-dom";
import {CSSTransition, SwitchTransition} from "react-transition-group";
import Header from "../components/Header/Header";
import HomeView from "../views/HomeView/HomeView";
import AuthView from "../views/AuthView/SignIn";
import PopularView from "../views/PopularView/PopularView";
import SearchView from "../views/SearchView/SearchView";
import WishlistView from "../views/WishlistView/WishlistView";
import "./AppRoutes.css"; // 애니메이션 CSS

const AppRoutes: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

    const handleLogout = () => {
        localStorage.setItem("isLoggedIn", "false");
        setIsLoggedIn(false);
    };

    const ConditionalHeader: React.FC = () => {
        const currentLocation = useLocation();
        const hideHeaderPaths = ["/movie-app/signin"];
        const shouldHideHeader = hideHeaderPaths.includes(currentLocation.pathname);

        return shouldHideHeader ? null : <Header isLoggedIn={isLoggedIn} onLogout={handleLogout}/>;
    };

    return (
        <Router>
            <ConditionalHeader/>
            <RoutesWithTransition isLoggedIn={isLoggedIn}/>
        </Router>
    );
};

interface RoutesWithTransitionProps {
    isLoggedIn: boolean;
}

const RoutesWithTransition: React.FC<RoutesWithTransitionProps> = ({isLoggedIn}) => {
    const location = useLocation();

    return (
        <SwitchTransition mode="out-in">
            <CSSTransition
                key={location.pathname} // 경로에 따라 애니메이션 적용
                classNames="page" // CSS 클래스
                timeout={300} // 애니메이션 지속 시간
            >
                <Routes location={location}>
                    <Route
                        path="/"
                        element={isLoggedIn ? <HomeView/> : <Navigate to="/movie-app/signin"/>}
                    />
                    <Route
                        path="/movie-app/"
                        element={isLoggedIn ? <HomeView/> : <Navigate to="/movie-app/signin"/>}
                    />
                    <Route path="/movie-app/signin" element={<AuthView/>}/>
                    <Route
                        path="/movie-app/popular"
                        element={isLoggedIn ? <PopularView/> : <Navigate to="/movie-app/signin"/>}
                    />
                    <Route
                        path="/movie-app/search"
                        element={isLoggedIn ? <SearchView/> : <Navigate to="/movie-app/signin"/>}
                    />
                    <Route
                        path="/movie-app/wishlist"
                        element={isLoggedIn ? <WishlistView/> : <Navigate to="/movie-app/signin"/>}
                    />
                </Routes>
            </CSSTransition>
        </SwitchTransition>
    );
};

export default AppRoutes;