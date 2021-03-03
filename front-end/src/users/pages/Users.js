import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/UIcomponents/ErrorModal';
import Spinner from '../../shared/UIcomponents/Spinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = props => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState();

    useEffect( () => {
        const fetchUsers = async () => {
            try {
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/api/users');
                setLoadedUsers(responseData.users);
            } catch (err){}
        };
        fetchUsers();
    }, [sendRequest]);
    
    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            {isLoading && <Spinner />}
            {!isLoading && loadedUsers && <UsersList users={loadedUsers}/>}
        </React.Fragment>
    );
};

export default Users;