import React, {useContext} from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import {AuthContext} from "../context/AuthContext";
import { useCookies } from 'react-cookie';
import {useHttp} from "../hooks/http.hook";

export const Navbar = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);

    const [cookies, setCookie] = useCookies(['sid-example']);
    //document.cookie = "sid-example3=World";
    // const cookieValue = document.cookie;
    //
    // console.log('cookieValue',cookieValue);
    // (()=> {
    //     setCookie('data', 'test', { path: '/' });
    // })()

    console.log('cookies', cookies);
    console.log('document.cookie',document.cookie )

    //console.log('setCookie', setCookie);

    const {request} = useHttp();

    const logoutHandler = (event) => {
        event.preventDefault()
        auth.logout()
        history.push('/')
        const data = request('/logout', 'GET', null, {

        });
        console.log('data', data);
    }

    //document.cookie = "sid-example2" + '= expires=Thu, 01 Jan 2021 00:00:00 UTC';
    //document.cookie = "sid-example3=World";

    // const cookieValue = document.cookie
    //     .split('; ')
    //     // .find(row => row.startsWith('sid-example'))
    //     // .split('=');
    // // console.log('cookieValue',cookieValue);
    // //
    // // console.log('document.cookie', document.cookie);
    // function alertCookieValue() {
    //     alert(cookieValue);
    // }

    if (auth.token){
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

}


















