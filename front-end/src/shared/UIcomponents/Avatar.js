import React from 'react';

import './Avatar.css';

const Avatar = props => {
    return (
        <div className='avatar' style={props.style}>
            <img 
                src={props.image}
                alt={props.alt}
                style={{ width: props.width, height: props.height }} />
            <label htmlFor={props.label}>{props.label}</label>
            <h4>{props.extra} reviews</h4>
        </div>
    );
};

export default Avatar;