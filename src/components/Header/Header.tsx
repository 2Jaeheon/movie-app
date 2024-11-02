import React from 'react';
import './Header.css';
import {Link} from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="logo">MyApp</div>
            <nav>
                <Link to="/home">Home</Link>
                <Link to="/search">Search</Link>
                <Link to="/wishlist">Wishlist</Link>
            </nav>
        </header>
    );
};

export default Header;