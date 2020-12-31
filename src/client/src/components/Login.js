import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../context/AuthContext";
import {useMessage} from "../hooks/message.hook";
import {useHttp} from "../hooks/http.hook";


export const Login = () => {
    const auth = useContext(AuthContext);
    const message = useMessage();
    const {loading, error, request, clearError} = useHttp();
    const [form, setForm] = useState({
        email: '', password:''
    });

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError])

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value});
    }
    const loginHandler = async () => {
        try {
            const data = await request('/login', 'POST', {...form});
            auth.login(data.token, data.userId);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div id="login" className="col s6">
            <h2>Login to store</h2>
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
                    <span className="helper-text" data-error="Enter your email"/>
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
                    <label htmlFor="password">Password</label>
                    <span className="helper-text" data-error="Enter password"/>
                </div>
                <button
                    className="btn btn-primary"
                    disabled={loading}
                    onClick={loginHandler}
                >
                    Log in
                </button>
            </div>
        </div>
    );
}








