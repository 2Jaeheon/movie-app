import React from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Header from "../components/Header/Header";
import HomeView from "../views/HomeView/HomeView";
import AuthView from "../views/AuthView/SignIn";
import PopularView from "../views/PopularView/PopularView";
import SearchView from "../views/SearchView/SearchView";
import WishlistView from "../views/WishlistView/WishlistView";

const AppRoutes: React.FC = () => {
    localStorage.setItem("isLoggedIn", "true");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    const handleLogout = () => {
        localStorage.setItem("isLoggedIn", "false");
        window.location.reload();
    };

    return (
        <Router>
            <Header isLoggedIn={isLoggedIn} onLogout={handleLogout}/>
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