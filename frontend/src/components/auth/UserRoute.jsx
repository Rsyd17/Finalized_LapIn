import React from 'react';
import { Navigate,Outlet } from 'react-router-dom';

const UserRoute = () => {
    //getting user info from localstorage
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    //if not loggin => go to login
    if (!user) {
        return <Navigate to = "/login" replace/>;
    }

    //if user is admin => go to admin dashboard
    if (user.role === 'admin'){
        return <Navigate to ='/admin' replace/>;
    }

    //if regular user> Allow
    return <Outlet />;
};

export default UserRoute