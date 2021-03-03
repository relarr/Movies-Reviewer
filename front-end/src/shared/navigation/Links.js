import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../shared/context/auth-context';
import './Links.css';

const Links = () => {
    const auth = useContext(AuthContext);

    return (
        <ul className='links'>
            <li>
                <NavLink to='/' exact>ALL USERS</NavLink>
            </li>
            {auth.isLoggedIn && <li>
                <NavLink to='/movies/new' >ADD NEW REVIEW</NavLink>
            </li>}
            {auth.isLoggedIn && <li>
                <NavLink to={`/${auth.userId}/movies`} >MY REVIEWS</NavLink>    
            </li>}
            {!auth.isLoggedIn && <li>
                <NavLink to='/auth'>AUTHENTICATE</NavLink>
            </li>}
            {/*auth.isLoggedIn && <li>
                <button onClick={auth.logoutContext}>LOGOUT</button> 
            </li>*/}
            {auth.isLoggedIn && <li>
                <NavLink to='/auth' onClick={auth.logoutContext}>LOGOUT</NavLink>    
            </li>}
        </ul>
    );
};

export default Links;