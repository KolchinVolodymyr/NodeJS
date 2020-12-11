import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../context/AuthContext";
import {useHttp} from "../hooks/http.hook";
import {useHistory} from 'react-router-dom';
import {useMessage} from "../hooks/message.hook";

export const AddCourse = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const {request, loading, clearError, error} = useHttp();
    const message = useMessage();
    const [course_add, setCourse_add] = useState({
        title: '', price:'', img:''
    });

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])


    const changeHandler = event => {
        setCourse_add({...course_add, [event.target.name]: event.target.value})
    }

    const pressHandler = async ()  => {
        try {
            const data = await request('/add-course', 'POST', {...course_add}, {
                Authorization: `Bearer ${auth.token}`
            })
            message(data.message);
            history.push(`/`);
        } catch (e) {console.log(e)}
    }

    return (
        <div>
           <h1>
               Добавить курс
           </h1>
            <div>
                <div className="input-field">
                    <input
                        id="title"
                        name="title"
                        type="text"
                        className="validate"
                        onChange={changeHandler}
                        required
                    />
                        <label htmlFor="title">Названые курса</label>
                        <span className="helper-text" data-error="Введите название"/>
                </div>
                <div className="input-field">
                    <input
                        id="price"
                        name="price"
                        type="number"
                        className="validate"
                        onChange={changeHandler}
                        required
                    />
                        <label htmlFor="price">Цена курса</label>
                        <span className="helper-text" data-error="Введите цену"/>
                </div>
                <div className="input-field">
                    <input
                        id="img"
                        name="img"
                        type="text"
                        className="validate"
                        onChange={changeHandler}
                        required
                    />
                        <label htmlFor="img">URL картинки</label>
                        <span className="helper-text" data-error="Введите URL картинки"/>
                </div>

                <button
                    className="btn btn-primary"
                    disabled={loading}
                    onClick={pressHandler}
                >
                    Добавить
                </button>
            </div>
        </div>
    );
}








