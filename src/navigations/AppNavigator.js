import React, { useContext } from 'react'
import UserNavigator from './UserNavigator';
import RestUserNavigator from './RestUserNavigator';
import { AuthContext } from '../context/authcontext';


const AppNavigator = () => {

    const { role } = useContext(AuthContext);

    return (
        <>
            {role == "Hr" || role == "Admin" ? <RestUserNavigator /> : <UserNavigator />}
        </>
    )
}

export default AppNavigator