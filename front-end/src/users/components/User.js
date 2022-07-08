import { Link } from 'react-router-dom';
import Container from '../../shared/UIcomponents/Container';
import Avatar from '../../shared/UIcomponents/Avatar';

const User = props => {
    return (
        <Container>
            <Link to={`/${props.id}/reviews`}>
                <Avatar
                    image={props.image}
                    label={props.name}
                    extra={props.movies}
                    height={70}
                    width={70} />
            </Link>
        </Container>
    );
};

export default User;