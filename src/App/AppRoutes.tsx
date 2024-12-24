import React, {useState, useEffect, useRef} from "react";
import {BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate} from "react-router-dom";
import {SwitchTransition, CSSTransition} from "react-transition-group";
import Header from "../components/Header/Header";
import HomeView from "../views/HomeView/HomeView";
import SignIn from "../views/AuthView/SignIn";
import PopularView from "../views/PopularView/PopularView";
import SearchView from "../views/SearchView/SearchView";
import WishlistView from "../views/WishlistView/WishlistView";
import "./AppRoutes.css";

const AppRoutes: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                const isValid = await validateToken(token);
                setIsLoggedIn(isValid);
            } else {
                setIsLoggedIn(false);
            }
            setIsLoading(false);
        };

        checkLoginStatus();
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = async (): Promise<void> => {
        localStorage.removeItem("accessToken");
        setIsLoggedIn(false);
    };

    const ConditionalHeader: React.FC = () => {
        const currentLocation = useLocation();
        const hideHeaderPaths = ["/movie-app/signin"];
        const shouldHideHeader = hideHeaderPaths.includes(currentLocation.pathname);
        return shouldHideHeader ? null : <Header isLoggedIn={isLoggedIn} onLogout={handleLogout}/>;
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <ConditionalHeader/>
            <RoutesWithTransition isLoggedIn={isLoggedIn} onLogin={handleLogin}/>
        </Router>
    );
};

interface RoutesWithTransitionProps {
    isLoggedIn: boolean;
    onLogin: () => void;
}

const RoutesWithTransition: React.FC<RoutesWithTransitionProps> = ({isLoggedIn, onLogin}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const nodeRef = useRef(null); // DOM 참조를 위한 ref 추가

    useEffect(() => {
        if (isLoggedIn && location.pathname === "/movie-app/signin") {
            navigate("/movie-app/", {replace: true});
        }
    }, [isLoggedIn, location.pathname, navigate]);

    return (
        <SwitchTransition mode="out-in">
            <CSSTransition
                key={location.pathname}
                classNames="page"
                timeout={300}
                nodeRef={nodeRef} // nodeRef로 DOM 참조 전달
            >
                <div ref={nodeRef}>
                    <Routes location={location}>
                        <Route
                            path="/"
                            element={<Navigate to="/movie-app/" replace/>}
                        />
                        <Route
                            path="/movie-app"
                            element={isLoggedIn ? <HomeView/> : <Navigate to="/movie-app/signin" replace/>}
                        />
                        <Route
                            path="/movie-app/"
                            element={isLoggedIn ? <HomeView/> : <Navigate to="/movie-app/signin" replace/>}
                        />
                        <Route
                            path="/movie-app/signin"
                            element={<SignIn onLogin={onLogin}/>}
                        />
                        <Route
                            path="/movie-app/popular"
                            element={isLoggedIn ? <PopularView/> : <Navigate to="/movie-app/signin" replace/>}
                        />
                        <Route
                            path="/movie-app/search"
                            element={isLoggedIn ? <SearchView/> : <Navigate to="/movie-app/signin" replace/>}
                        />
                        <Route
                            path="/movie-app/wishlist"
                            element={isLoggedIn ? <WishlistView/> : <Navigate to="/movie-app/signin" replace/>}
                        />
                    </Routes>
                </div>
            </CSSTransition>
        </SwitchTransition>
    );
};

async function validateToken(token: string): Promise<boolean> {
    // 실제 구현에서는 서버에 토큰 유효성 검사 요청을 보내야 합니다.
    return token.length > 0;
}

export default AppRoutes;
