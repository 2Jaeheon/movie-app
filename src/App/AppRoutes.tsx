import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomeView from '../views/HomeView/HomeView';
import AuthView from '../views/AuthView/SignIn';
import PopularView from '../views/PopularView/PopularView';
import WishlistView from '../views/PopularView/PopularView';

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/" element={<HomeView/>}/>
            <Route path="/signin" element={<AuthView/>}/>
            <Route path="/popular" element={<PopularView/>}/>
            <Route path="/wishlist" element={<WishlistView/>}/>
        </Routes>
    </Router>
);

export default AppRoutes;