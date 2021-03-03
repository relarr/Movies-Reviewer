import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';

import Users from './users/pages/Users';
import Navigation from './shared/navigation/Navigation';
import Spinner from './shared/UIcomponents/Spinner';
import { AuthContext } from './shared/context/auth-context';

const UserMovies = lazy(() =>  import('./movies/pages/UserMovies'));
const NewMovie = lazy(() => import('./movies/pages/NewMovie'));
const UpdateMovie = lazy(() => import('./movies/pages/UpdateMovie'));
const Auth = lazy(() => import('./users/pages/Auth'));

let logoutTimer;

function App() {
  const [token, setToken] = useState(false);
  const [tokenExpiration, setTokenExpiration] = useState();
  const [userId, setUserId] = useState(null);

  const loginHandler = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);

    const tokenExpirationDate = expirationDate || new Date(new Date().getTime()+1000*60*60);
    setTokenExpiration(tokenExpirationDate);
    localStorage.setItem(
                    'userData', 
                    JSON.stringify({ userId: uid, token, expiration: tokenExpirationDate.toISOString() }));
  }, []);

  const logoutHandler = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpiration(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if (token && tokenExpiration){
      const remainingTime = tokenExpiration.getTime()-new Date().getTime();
      logoutTimer = setTimeout(logoutHandler, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logoutHandler, tokenExpiration])

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()){
      loginHandler(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [loginHandler]);

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path='/' exact>
          <Users />
        </Route>
        <Route path='/:uid/movies' exact>
          <UserMovies />
        </Route>
        <Route path='/movies/new' exact>
          <NewMovie />
        </Route>
        <Route path='/movies/:mid'>
          <UpdateMovie />
        </Route>
        <Redirect to='/' />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path='/' exact>
          <Users />
        </Route>
        <Route path='/:uid/movies' exact>
          <UserMovies />
        </Route>
        <Route path='/auth'>
          <Auth />
        </Route>
        <Redirect to='/auth' />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token,
                                    token: token,
                                    userId: userId,
                                    loginContext: loginHandler,
                                    logoutContext: logoutHandler}}>
      <BrowserRouter>
        <div className="App">
          <Navigation />
            <main>
              <Suspense fallback={<div className='center'><Spinner /></div>}>
                {routes}
              </Suspense>
            </main>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
