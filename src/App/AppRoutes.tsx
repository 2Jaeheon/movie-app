import React from "react";
import {BrowserRouter as Router, Routes, Route, Navigate, useLocation} from "react-router-dom";
import Header from "../components/Header/Header";
import HomeView from "../views/HomeView/HomeView";
import AuthView from "../views/AuthView/SignIn";
import PopularView from "../views/PopularView/PopularView";
import SearchView from "../views/SearchView/SearchView";
import WishlistView from "../views/WishlistView/WishlistView";

const AppRoutes: React.FC = () => {
    localStorage.setItem("isLoggedIn", "true"); // 임시로 로그인 상태 유지
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    const handleLogout = () => {
        localStorage.setItem("isLoggedIn", "false");
        window.location.reload();
    };

    const ConditionalHeader: React.FC = () => {
        const location = useLocation();
        const hideHeaderPaths = ["/signin"]; // 헤더를 숨길 경로
        const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

        return shouldHideHeader ? null : <Header isLoggedIn={isLoggedIn} onLogout={handleLogout}/>;
    };

    return (
        <Router>
            <ConditionalHeader/>
            <Routes>
                <Route path="/" element={isLoggedIn ? <HomeView/> : <Navigate to="/signin"/>}/>
                <Route path="/signin" element={<AuthView/>}/>
                <Route path="/popular" element={isLoggedIn ? <PopularView/> : <Navigate to="/signin"/>}/>
                <Route path="/search" element={isLoggedIn ? <SearchView/> : <Navigate to="/signin"/>}/>
                <Route path="/wishlist" element={isLoggedIn ? <WishlistView/> : <Navigate to="/signin"/>}/>
            </Routes>
        </Router>
    );
};

export default AppRoutes;