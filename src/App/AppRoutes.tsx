// src/app/AppRoutes.tsx
import React from 'react';
import {Routes, Route, Navigate, useLocation} from 'react-router-dom';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import './AppRoutes.css';

const AppRoutes: React.FC = () => {
    const location = useLocation();

    return (
        <TransitionGroup>
            <CSSTransition key={location.key} classNames="page" timeout={300}>
                <Routes location={location}>
                </Routes>
            </CSSTransition>
        </TransitionGroup>
    );
};

export default AppRoutes;