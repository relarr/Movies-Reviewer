import React from 'react';

import './Cheader.css';

const Cheader = props => {
    return <header className='cheader'>{props.children}</header>
};

export default Cheader;