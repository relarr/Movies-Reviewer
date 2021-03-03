import React from 'react';
import { Link } from 'react-router-dom';

import './Cbutton.css';

const Cbutton = props => {
    if (props.to){
        return (
            <Link
                to={props.to}
                exact={props.exact}
                className={`Cbutton
                    ${props.reversed && 'Cbutton--reversed'}
                    ${props.danger && 'Cbutton--danger'}`} >
                {props.children}
            </Link>
        )
    }

    return <button 
            className={`Cbutton 
                ${props.reversed && 'Cbutton--reversed'} 
                ${props.danger && 'Cbutton--danger'}`}
            type={props.type}
            disabled={props.disabled}
            onClick={props.onClick}>{props.children}</button>
};

export default Cbutton;