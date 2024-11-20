import React, {useState} from "react";
import {BrowserRouter as Router, Routes, Route, Navigate, useLocation} from "react-router-dom";
import Header from "../components/Header/Header";
import HomeView from "../views/HomeView/HomeView";
import AuthView from "../views/AuthView/SignIn";
import PopularView from "../views/PopularView/PopularView";
import SearchView from "../views/SearchView/SearchView";
import WishlistView from "../views/WishlistView/WishlistView";

const AppRoutes: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

    const handleLogout = () => {
        localStorage.setItem("isLoggedIn", "false"); // 로컬 스토리지에서 로그아웃 상태로 설정
        setIsLoggedIn(false); // 상태 업데이트
    };

    const ConditionalHeader: React.FC = () => {
        const location = useLocation();
        const hideHeaderPaths = ["/movie-app/signin"]; // 헤더를 숨길 경로
        const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

        return shouldHideHeader ? null : <Header isLoggedIn={isLoggedIn} onLogout={handleLogout}/>;
    };

    return (
        <Router>
            <ConditionalHeader/>
            <Routes>
                <Route path="/" element={isLoggedIn ? <HomeView/> : <Navigate to="/movie-app/signin"/>}/>
                <Route path="/movie-app/" element={isLoggedIn ? <HomeView/> : <Navigate to="/movie-app/signin"/>}/>
                <Route path="/movie-app/signin" element={<AuthView/>}/>
                <Route path="/movie-app/popular"
                       element={isLoggedIn ? <PopularView/> : <Navigate to="/movie-app/signin"/>}/>
                <Route path="/movie-app/search"
                       element={isLoggedIn ? <SearchView/> : <Navigate to="/movie-app/signin"/>}/>
                <Route path="/movie-app/wishlist"
                       element={isLoggedIn ? <WishlistView/> : <Navigate to="/movie-app/signin"/>}/>
            </Routes>
        </Router>
    );
};

export default AppRoutes;