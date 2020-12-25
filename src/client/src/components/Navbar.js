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
        request('/logout', 'GET', null, {});
        history.push('/')
    }

    if (auth.token){
        return (
            <nav>
                <div className="nav-wrapper">
                    <a href="/" className="brand-logo">
                        Курсы
                    </a>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li><NavLink to="/">Главная</NavLink></li>
                        <li><NavLink to="/courses">Курсы</NavLink></li>
                        <li><NavLink to="/add-course">Добавить курс</NavLink></li>
                        <li><NavLink to="/profile">Профиль</NavLink></li>
                        <li><NavLink to="/card">Корзина</NavLink></li>
                        <li><NavLink to="/orders">Заказы</NavLink></li>
                        <li><a href="/logout" onClick={logoutHandler}>Выйти</a></li>
                    </ul>
                </div>
            </nav>
        )
    } else {
        return (
            <nav>
                <div className="nav-wrapper">
                    <a href="/" className="brand-logo">
                        <img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngwing.com%2Fru%2Ffree-png-henbv&psig=AOvVaw1zLpAqCY2ob63zEVkqB_Md&ust=1608984346504000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCNinmPeL6e0CFQAAAAAdAAAAABAD" alt=""/>
                        Курсы
                    </a>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li><NavLink to="/">Главная</NavLink></li>
                        <li><NavLink to="/courses">Курсы</NavLink></li>
                        <li><a href="/login" >Войти</a></li>
                    </ul>
                </div>
            </nav>
        )
    }

}


















