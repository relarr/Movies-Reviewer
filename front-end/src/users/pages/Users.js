import { useEffect, useState } from 'react';
import UsersList from '../components/UsersList';
import LoadingSpinner from '../../shared/UIcomponents/LoadingSpinner';

const Users = () => {
    const [users, setUsers] = useState();
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(process.env.REACT_APP_BACKEND_URL + '/users');
            const resJson = await res.json();
            setLoading(false);
            setUsers(resJson.users);
        } catch (err) {}
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            {loading && <LoadingSpinner asOverlay />}
            {users && <UsersList users={users} />}
        </div>
    );
};

export default Users;