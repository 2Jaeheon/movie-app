import {useState} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
    // 상태 변수 설정
    const [message, setMessage] = useState('Edit src/App.js and save to reload.');

    // 버튼 클릭 시 상태 변경 함수
    const handleClick = () => {
        setMessage('You clicked the button!');
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>{message}</p>
                <button onClick={handleClick} className="App-button">
                    Click me
                </button>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;