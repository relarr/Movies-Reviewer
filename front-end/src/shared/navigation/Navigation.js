import { useState } from "react";
import { NavLink } from 'react-router-dom';
import SideDrawer from './SideDrawer';
import Backdrop from "../UIcomponents/Backdrop";
import Header from './Header';
import Links from './Links';
import './Navigation.css';

const Navigation = props => {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);

    return (
        <div className="navigation">
            {drawerIsOpen && <Backdrop onClick={() => setDrawerIsOpen(false)} />}
            <SideDrawer
                show={drawerIsOpen}
                onClick={() => setDrawerIsOpen(false)}>
                <nav className="navigation-sidedrawer">
                    <Links />
                </nav>
            </SideDrawer>
            <Header>
                <button 
                    className="navigation-burger"
                    onClick={() => setDrawerIsOpen(true)} >
                    <span />
                    <span />
                    <span />
                </button>
                <h2 className="navigation-title">
                    <NavLink to="/">MOVIES REVIEWER</NavLink>
                </h2>
                <nav className="navigation-header">
                    <Links />
                </nav>
            </Header>
        </div>
    );
};

export default Navigation;