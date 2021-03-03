import React from 'react';
import { Link } from 'react-router-dom';

import Container from '../../shared/UIcomponents/Container';
import Avatar from '../../shared/UIcomponents/Avatar';

const User = props => {
    return (
        <div>
            <Container avatar>
                <Link to={`/${props.id}/movies`}>
                <Avatar
                    image={process.env.REACT_APP_BACKEND_URL + `/${props.image}`}
                    label={props.name}
                    extra={props.movies}
                    height={100}
                    width={100} />
                </Link>
            </Container>
        </div>
    );
};

export default User;