// src/app/AppRoutes.tsx
import React from 'react';
import {Routes, Route, Navigate, useLocation} from 'react-router-dom';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import Home from '../components/Home/Home';
import Search from '../components/Search/Search';
import './AppRoutes.css';
import Wishlist from "../components/Home/Wishlist/Wishlist"; // 전환 효과 CSS

const AppRoutes: React.FC = () => {
    const location = useLocation();

    return (
        <TransitionGroup>
            <CSSTransition key={location.key} classNames="page" timeout={300}>
                <Routes location={location}>
                    <Route path="/" element={<Navigate to="/home" replace/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/search" element={<Search/>}/>
                    <Route path="/wishlist" element={<Wishlist/>}/>
                </Routes>
            </CSSTransition>
        </TransitionGroup>
    );
};

export default AppRoutes;