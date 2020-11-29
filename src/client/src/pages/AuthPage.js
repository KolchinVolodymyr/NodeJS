import React, {useState, useEffect, useContext} from 'react';
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {AuthContext} from "../context/AuthContext";

export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const message = useMessage();
    const {loading, error, request, clearError} = useHttp();

    const [form, setForm] = useState({
        email: '', password:''
    });

    const [formRegister, setFormRegister] = useState({
        email: '', password:'' , confirm: '', name: ''
    });

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }
    const changeHandlerRegister = event => {
        setFormRegister({...formRegister, [event.target.name]: event.target.value})
    }

    const registerHandler = async () => {
        try {
            const data = await request('/register', 'POST', {...formRegister});
            message(data.message)
        } catch (e) {}
    }
    const loginHandler = async () => {
        try {
            const data = await request('/login', 'POST', {...form})
            auth.login(data.token, data.userId)
        } catch (e) {}
    }

    return (
        <div className="auth">
            <div className="row">
                <div className="col s12">
                    <ul className="tabs">
                        <li className="tab col s6"><a className="active" href="#login">Войти</a></li>
                        <li className="tab col s6"><a href="#register">Регистрация</a></li>
                    </ul>
                </div>
                <div id="login" className="col s6 offset-s3">
                    <h1>Войти в магазин</h1>

                    <div>
                        <div className="input-field">
                            <input
                                id="email"
                                type="email"
                                name="email"
                                className="validate"
                                onChange={changeHandler}
                                required
                            />
                                <label htmlFor="email">Email</label>
                                <span className="helper-text" data-error="Введите email"></span>
                        </div>
                        <div className="input-field">
                            <input
                                id="password"
                                type="password"
                                className="validate"
                                name="password"
                                onChange={changeHandler}
                                required
                            />
                                <label htmlFor="password">Пароль</label>
                                <span className="helper-text" data-error="Введите пароль"></span>
                        </div>
                        <p><a href="/reset">Забыли пароль?</a></p>
                        <button
                            className="btn btn-primary"
                            disabled={loading}
                            onClick={loginHandler}
                        >
                            Войти
                        </button>
                    </div>
                </div>
                <div id="register" className="col s6 offset-s3">
                    <h1>Создать аккаунт </h1>
                    <div>
                        <div className="input-field">
                            <input
                                id="remail"
                                name="email"
                                type="email"
                                className="validate"
                                onChange={changeHandlerRegister}
                                required
                            />
                                <label htmlFor="remail">Email</label>
                                <span className="helper-text" data-error="Введите email"></span>
                        </div>
                        <div className="input-field">
                            <input
                                id="rpassword"
                                name="password"
                                type="password"
                                className="validate"
                                onChange={changeHandlerRegister}
                                required
                            />
                                <label htmlFor="rpassword">Пароль</label>
                                <span className="helper-text" data-error="Введите пароль"></span>
                        </div>
                        <div className="input-field">
                            <input
                                id="confirm"
                                name="confirm"
                                type="password"
                                className="validate"
                                onChange={changeHandlerRegister}
                                required
                            />
                                <label htmlFor="confirm">Пароль еще раз</label>
                                <span className="helper-text" data-error="Введите пароль"></span>
                        </div>
                        <div className="input-field">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className="validate"
                                onChange={changeHandlerRegister}
                                required
                            />
                                <label htmlFor="name">Ваше имя</label>
                                <span className="helper-text" data-error="Введите имя"></span>
                        </div>
                        <button
                            className="btn btn-primary"
                            type="submit"
                            disabled={loading}
                            onClick={registerHandler}
                        >
                            Зарегистрироватся
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
}








