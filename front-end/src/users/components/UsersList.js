import React from 'react';

import User from './User';

import './UsersList.css';

const UsersList = props => { 
    return (
        <div className='users-list'>
            {props.users.map(user => (
                <User 
                    id={user.id}
                    key={user.id}
                    name={user.name}
                    image={user.image}
                    movies={user.movies.length} />
            ))}
        </div>
    );
};

export default UsersList;