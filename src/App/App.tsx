// src/app/App.tsx
import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import './App.css';

const App: React.FC = () => {
    return (
        <Router>
            <div className="app">
                <h1>리엑트 프로젝트 시작!!</h1>
            </div>
        </Router>
    );
};

export default App;