import User from './User';
import "./UsersList.css";

const UsersList = props => {
    return (
        <div className='users-list'>
            {props.users && props.users.map(user => (
                <User
                    key={user.id}
                    id={user.id}
                    name={user.name}
                    image={user.image}
                    movies={user.reviews.length} />
            ))}
        </div>
    );
};

export default UsersList;