import React, {useContext} from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import {AuthContext} from "../context/AuthContext";
import {useHttp} from "../hooks/http.hook";

export const Navbar = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const {request} = useHttp();

    const logoutHandler = (event) => {
        event.preventDefault();
        auth.logout();
        request('/logout', 'POST', null, {});
        history.push('/')
    }

    if (auth.token){
        return (
            <nav>
                <div className="nav-wrapper">
                    <a href="/" className="brand-logo">
                        Courses
                    </a>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li><NavLink to="/">Home</NavLink></li>
                        <li><NavLink to="/courses">Courses</NavLink></li>
                        <li><NavLink to="/add-course">Add course</NavLink></li>
                        <li><NavLink to="/profile">Profile</NavLink></li>
                        <li><NavLink to="/card">Basket</NavLink></li>
                        <li><NavLink to="/orders">Orders</NavLink></li>
                        <li><a href="/logout" onClick={logoutHandler}>Go out</a></li>
                    </ul>
                </div>
            </nav>
        )
    } else {
        return (
            <nav>
                <div className="nav-wrapper">
                    <a href="/" className="brand-logo">
                        Courses
                    </a>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li><NavLink to="/">Home</NavLink></li>
                        <li><NavLink to="/courses">Courses</NavLink></li>
                        <li><a href="/login">Log in</a></li>
                    </ul>
                </div>
            </nav>
        )
    }

}


















