import React, {useContext} from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import {AuthContext} from "../context/AuthContext";



export const Navbar = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);

    const logoutHandler = event => {
        event.preventDefault()
        auth.logout()
        history.push('/')
    }


        return (

            <nav>
                <div className="nav-wrapper">
                    <a href="/" className="brand-logo">Интернет магазин</a>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li><NavLink to="/">Главная</NavLink></li>
                        <li><NavLink to="/courses">Курсы</NavLink></li>
                        <li><NavLink to="/add-course">Добавить курс</NavLink></li>
                        <li><NavLink to="/profile">Профиль</NavLink></li>
                        <li><NavLink to="/card">Корзина</NavLink></li>
                        <li><NavLink to="/order">Заказы</NavLink></li>
                        <li><a href="/login" onClick={logoutHandler}>Выйти</a></li>
                    </ul>
                </div>
            </nav>
        )

}


















