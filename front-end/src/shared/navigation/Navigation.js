import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import Cheader from './Cheader';
import Links from './Links';
import SideDrawer from './SideDrawer';
import Backdrop from '../UIcomponents/Backdrop';
import './Navigation.css';

const Navigation = props => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const openDrawerHandler = () => {
        setDrawerOpen(true);
    };

    const closeDrawerHandler = () => {
        setDrawerOpen(false);
    };


    return (
        <React.Fragment>
            {drawerOpen && <Backdrop onClick={closeDrawerHandler}/>}
            <SideDrawer show={drawerOpen} onClick={closeDrawerHandler}>
                <nav className='navigation-sidedrawer'>
                    <Links />
                </nav>
            </SideDrawer>

            <Cheader>
                <button 
                    className='navigation-burger'
                    onClick={openDrawerHandler}>
                        <span />
                        <span />
                        <span />
                </button>
                <h2 className='navigation-title'>
                    <NavLink to='/'>MOVIE REVIEWER</NavLink>
                </h2>
                    
                <nav className='navigation-header'>
                    <Links />
                </nav>
            </Cheader>
        </React.Fragment>
    );
};

export default Navigation;