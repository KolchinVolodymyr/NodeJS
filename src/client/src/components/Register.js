import React, {useEffect, useState} from 'react';
import {useMessage} from "../hooks/message.hook";
import {useHttp} from "../hooks/http.hook";


export const Register = () => {
    const message = useMessage();
    const {loading, error, request, clearError} = useHttp();

    const [formRegister, setFormRegister] = useState({
        email: '', password:'' , confirm: '', name: ''
    });

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    const changeHandlerRegister = event => {
        setFormRegister({...formRegister, [event.target.name]: event.target.value})
    }

    const registerHandler = async () => {
        try {
            const data = await request('/register', 'POST', {...formRegister});
            message(data.message)
        } catch (e) {}
    }

    return (
        <div id="register" className="col s6">
            <h2>Создать аккаунт </h2>
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
                    <span className="helper-text" data-error="Введите email"/>
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
                    <span className="helper-text" data-error="Введите пароль"/>
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
                    <span className="helper-text" data-error="Введите пароль"/>
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
                    <span className="helper-text" data-error="Введите имя"/>
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
    );
}








