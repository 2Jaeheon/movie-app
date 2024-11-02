// src/app/App.tsx
import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import AppRoutes from './AppRoutes';
import './App.css';
import Header from '../components/Header/Header';

const App: React.FC = () => {
    return (
        <Router>
            <div className="app">
                <Header/>
                <AppRoutes/>
            </div>
        </Router>
    );
};

export default App;