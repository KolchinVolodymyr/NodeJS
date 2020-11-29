import React from 'react'
import {NavLink} from "react-router-dom";


export const Navbar2 = () => {


    return (
        <nav>
            <div className="nav-wrapper">
                <a href="/" className="brand-logo">Интернет магазин</a>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink to="/">Главная</NavLink></li>
                    <li><NavLink to="/courses">Курсы</NavLink></li>
                    <li><a href="/login" >Войти</a></li>
                </ul>
            </div>
        </nav>
    )

}


















