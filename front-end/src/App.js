import { useState, useCallback, useEffect } from 'react';
import { AuthContext } from './shared/context/auth-context';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from "./shared/navigation/Navigation";
import Auth from './users/pages/Auth';
import Users from './users/pages/Users';
import NewReview from './reviews/pages/NewReview';
import UserReviews from './reviews/pages/UserReviews';

let logoutTimer;

const App = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tokenExpiration, setTokenExpiration] = useState();

  const loginHandler = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);

    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpiration(tokenExpirationDate);
    localStorage.setItem('userData', JSON.stringify({ userId: uid, token, expiration: tokenExpirationDate.toISOString() }));
  }, []);

  const logoutHandler = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpiration(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if (token && tokenExpiration){
      const remainingTime = tokenExpiration.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logoutHandler, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logoutHandler, tokenExpiration]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      loginHandler(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [loginHandler]);

  let routes;
  if (token){
    routes = (
      <Routes>
        <Route path='/users' element={<Users />} />
        <Route path='/:uid/reviews' element={<UserReviews />} />
        <Route path='/reviews/new' element={<NewReview />} />
        <Route path='/' element={<Users />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path='/' element={<Auth />} />
        <Route path='/users' element={<Users />} />
        <Route path='/:uid/reviews' element={<UserReviews />} />
      </Routes>
    );
  }


  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, 
                                   token,
                                   userId, 
                                   loginContext: loginHandler,
                                   logoutContext: logoutHandler }}>
      <BrowserRouter>
        <Navigation />
        <main>
          {routes}
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
