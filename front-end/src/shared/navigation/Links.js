import { useContext } from "react";
import { NavLink} from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import "./Links.css";

const Links = () => {
    const auth = useContext(AuthContext);

    return (
        <ul className="links">
            <li>
                <NavLink to="/users">ALL USERS</NavLink>
            </li>
            {!auth.isLoggedIn && <li>
                <NavLink to="/">AUTHENTICATE</NavLink>
            </li>}
            {auth.isLoggedIn && <li>
                <NavLink to={`/${auth.userId}/reviews`}>MY REVIEWS</NavLink>
            </li>}
            {auth.isLoggedIn && <li>
                <NavLink to="/reviews/new">ADD A REVIEW</NavLink>    
            </li>}
            {auth.isLoggedIn && <li>
                <NavLink to="/" onClick={auth.logoutContext}>LOG OUT</NavLink>
            </li>}
        </ul>
    );
};

export default Links;