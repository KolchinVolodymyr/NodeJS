import React from 'react';
import {Login} from "../components/Login";
import {Register} from "../components/Register";

export const AuthPage = () => {

    return (
        <div className="auth">
            <div className="row">
                <Login/>
                <Register/>
            </div>
        </div>
    );
}








