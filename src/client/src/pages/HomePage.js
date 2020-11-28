
import React, {useContext} from 'react';
import {AuthContext} from "../context/AuthContext";


export const HomePage = () => {

    const auth = useContext(AuthContext);
    return (
        <div>
           Home Page
        </div>
    );
}








