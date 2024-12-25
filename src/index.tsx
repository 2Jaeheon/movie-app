import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App/App';
import reportWebVitals from './reportWebVitals';

// 특정 경고 메시지 무시 설정
const originalConsoleError = console.error;
console.error = (...args) => {
    if (
        typeof args[0] === "string" &&
        args[0].includes("Warning: Encountered two children with the same key")
    ) {
        // "Encountered two children with the same key" 경고 무시
        return;
    }
    originalConsoleError(...args);
};

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();